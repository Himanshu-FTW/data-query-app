# Data Query Assistant

A modern web application that allows users to upload Excel or CSV files and query the data using natural language. Built with React, Node.js, and OpenAI's GPT model for intelligent data analysis.

## Features

- 📁 **File Upload**: Support for Excel (.xlsx, .xls) and CSV files
- 🤖 **Natural Language Queries**: Ask questions in plain English about your data
- 📊 **Data Visualization**: Automatic suggestions for charts and visualizations
- 🔍 **Smart Analysis**: AI-powered data analysis and insights
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- ⚡ **Real-time Processing**: Fast file processing and query responses

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Dropzone for file uploads
- React Hot Toast for notifications
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express
- Multer for file upload handling
- XLSX for Excel file parsing
- CSV Parser for CSV file processing
- Groq API for natural language processing
- Helmet for security headers
- Rate limiting for API protection

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key (get one from [Groq Console](https://console.groq.com/keys))

## Installation

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-query-app
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example .env
   
   # Edit the .env file and add your Groq API key
   nano .env
   ```

3. **Run with Docker Compose**
   ```bash
   # Production build
   docker-compose up --build
   
   # Or run in background
   docker-compose up -d --build
   ```

4. **Open your browser**
   - Application: http://localhost:3001

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-query-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (frontend + backend)
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit the .env file and add your Groq API key
   nano server/.env
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Usage

### 1. Upload Your Data
- Drag and drop your Excel or CSV file onto the upload area
- Or click to browse and select a file
- Supported formats: `.xlsx`, `.xls`, `.csv`
- Maximum file size: 10MB

### 2. Ask Questions
Once your file is uploaded, you can ask questions like:
- "What is the average sales for each region?"
- "Show me the top 5 products by revenue"
- "How many customers are in each category?"
- "What's the trend in monthly sales?"
- "Find the highest and lowest values in the dataset"

### 3. View Results
The application will provide:
- **AI Analysis**: Natural language explanation of the data
- **Calculations**: Specific mathematical operations performed
- **Data Points**: Key statistics and insights
- **Visualization Suggestions**: Recommended chart types
- **Computed Results**: Actual calculated values

## API Endpoints

### File Upload
- `POST /api/upload` - Upload Excel or CSV file
- `GET /api/data` - Get uploaded data preview

### Queries
- `POST /api/query` - Submit natural language query
- `GET /api/health` - Health check endpoint

## Example Queries

Here are some example questions you can ask about your data:

**Basic Statistics:**
- "What is the average value in column X?"
- "Show me the total count of records"
- "What are the highest and lowest values?"

**Grouping and Aggregation:**
- "Group the data by category and show the sum"
- "What is the average sales per region?"
- "Count the number of items in each department"

**Filtering:**
- "Show only records where sales > 1000"
- "Filter data for the last quarter"
- "Find all products with price above average"

**Trends and Patterns:**
- "What's the trend in monthly revenue?"
- "Show me the growth rate over time"
- "Identify any outliers in the data"

## Security Features

- File type validation
- File size limits (10MB)
- Rate limiting on API endpoints
- Security headers with Helmet
- CORS protection
- Input sanitization

## Docker Commands

### Production
```bash
# Build and run production container
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

### Development
```bash
# Run development environment with hot reloading
docker-compose --profile dev up --build

# Stop development containers
docker-compose --profile dev down
```

### Manual Docker Commands
```bash
# Build the image
docker build -t data-query-app .

# Run the container
docker run -p 3001:3001 -e GROQ_API_KEY=your-key data-query-app

# Run with environment file
docker run -p 3001:3001 --env-file .env data-query-app
```

## Development

### Project Structure
```
data-query-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main app component
│   │   └── index.tsx       # Entry point
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables example
├── Dockerfile             # Production Docker configuration
├── Dockerfile.dev         # Development Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── .dockerignore          # Docker ignore file
├── package.json           # Root package.json
└── README.md              # This file
```

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for all packages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Verify your Groq API key is correctly set
3. Ensure your file format is supported
4. Check that your file size is under 10MB

## Future Enhancements

- [ ] Database integration for persistent storage
- [ ] User authentication and data privacy
- [ ] Advanced data visualization with charts
- [ ] Export functionality for analysis results
- [ ] Support for more file formats
- [ ] Batch processing for multiple files
- [ ] Custom query templates
- [ ] Data validation and cleaning tools 