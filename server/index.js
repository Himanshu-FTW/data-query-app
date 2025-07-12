const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const OpenAI = require('openai');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize Groq (using OpenAI-compatible client)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (error) {
        console.error('Error creating uploads directory:', error);
        // Fallback to temp directory
        cb(null, '/tmp');
        return;
      }
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// In-memory storage for uploaded data (in production, use a database)
let uploadedData = null;
let dataColumns = [];

// Parse Excel file
function parseExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length === 0) {
      throw new Error('Excel file is empty');
    }
    
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    return { headers, rows };
  } catch (error) {
    throw new Error(`Error parsing Excel file: ${error.message}`);
  }
}

// Parse CSV file
function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let headers = [];
    let isFirstRow = true;
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (isFirstRow) {
          headers = Object.keys(data);
          isFirstRow = false;
        }
        results.push(data);
      })
      .on('end', () => {
        resolve({ headers, rows: results });
      })
      .on('error', (error) => {
        reject(new Error(`Error parsing CSV file: ${error.message}`));
      });
  });
}

// Upload file endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let parsedData;
    
    if (fileExtension === '.csv') {
      parsedData = await parseCSVFile(filePath);
    } else if (['.xlsx', '.xls'].includes(fileExtension)) {
      parsedData = parseExcelFile(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }
    
    // Store data in memory
    uploadedData = parsedData.rows;
    dataColumns = parsedData.headers;
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.json({
      message: 'File uploaded successfully',
      columns: dataColumns,
      rowCount: uploadedData.length,
      preview: uploadedData.slice(0, 5) // First 5 rows as preview
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Query data endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!uploadedData || uploadedData.length === 0) {
      return res.status(400).json({ error: 'No data uploaded. Please upload a file first.' });
    }
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Prepare data context for AI
    const dataContext = {
      columns: dataColumns,
      sampleData: uploadedData.slice(0, 10), // First 10 rows for context
      totalRows: uploadedData.length
    };
    
    // Create AI prompt
    const prompt = `You are a data analyst assistant. You have access to a dataset with the following structure:

Columns: ${dataContext.columns.join(', ')}
Total rows: ${dataContext.totalRows}
Sample data: ${JSON.stringify(dataContext.sampleData, null, 2)}

User query: "${query}"

Please analyze the data and provide a comprehensive answer. If the query requires calculations, provide the specific calculations and results. If it requires filtering or grouping, explain the logic.

Respond in JSON format with the following structure:
{
  "answer": "Your detailed answer here",
  "calculations": "Any calculations performed",
  "dataPoints": "Relevant data points or statistics",
  "visualization": "suggested chart type if applicable (bar, line, pie, table)"
}`;

    // Get AI response from Groq
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192", // Fast and efficient model
      messages: [
        {
          role: "system",
          content: "You are a helpful data analyst assistant. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });
    
    const aiResponse = completion.choices[0].message.content;
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // If AI response is not valid JSON, format it manually
      parsedResponse = {
        answer: aiResponse,
        calculations: "Analysis completed",
        dataPoints: "Data analyzed",
        visualization: "table"
      };
    }
    
    // Add actual data analysis based on the query
    const analysis = analyzeData(query, uploadedData, dataColumns);
    
    res.json({
      query: query,
      response: parsedResponse,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple data analysis function
function analyzeData(query, data, columns) {
  const lowerQuery = query.toLowerCase();
  const analysis = {
    summary: {},
    filteredData: [],
    calculations: {}
  };
  
  // Basic statistics
  if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
    columns.forEach(col => {
      const numericValues = data
        .map(row => parseFloat(row[col]))
        .filter(val => !isNaN(val));
      
      if (numericValues.length > 0) {
        const avg = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
        analysis.calculations[`average_${col}`] = avg.toFixed(2);
      }
    });
  }
  
  if (lowerQuery.includes('count') || lowerQuery.includes('total')) {
    analysis.summary.totalRows = data.length;
    columns.forEach(col => {
      const uniqueValues = new Set(data.map(row => row[col]));
      analysis.summary[`unique_${col}`] = uniqueValues.size;
    });
  }
  
  if (lowerQuery.includes('max') || lowerQuery.includes('highest')) {
    columns.forEach(col => {
      const numericValues = data
        .map(row => parseFloat(row[col]))
        .filter(val => !isNaN(val));
      
      if (numericValues.length > 0) {
        analysis.calculations[`max_${col}`] = Math.max(...numericValues);
      }
    });
  }
  
  if (lowerQuery.includes('min') || lowerQuery.includes('lowest')) {
    columns.forEach(col => {
      const numericValues = data
        .map(row => parseFloat(row[col]))
        .filter(val => !isNaN(val));
      
      if (numericValues.length > 0) {
        analysis.calculations[`min_${col}`] = Math.min(...numericValues);
      }
    });
  }
  
  return analysis;
}

// Get data preview endpoint
app.get('/api/data', (req, res) => {
  if (!uploadedData) {
    return res.status(404).json({ error: 'No data uploaded' });
  }
  
  res.json({
    columns: dataColumns,
    data: uploadedData,
    totalRows: uploadedData.length
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 