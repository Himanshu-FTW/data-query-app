import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface FileUploadProps {
  onUpload: (data: any) => void;
  setIsLoading: (loading: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, setIsLoading }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpload(response.data);
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  }, [onUpload, setIsLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <FileSpreadsheet className="w-6 h-6 text-gray-400" />
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop your file here' : 'Upload your Excel or CSV file'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop, or click to select a file
            </p>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>Supported formats: .xlsx, .xls, .csv</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Your data will be processed securely and won't be stored permanently
        </p>
      </div>
    </div>
  );
};

export default FileUpload; 