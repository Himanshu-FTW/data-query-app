import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import DataViewer from './components/DataViewer';
import QueryInterface from './components/QueryInterface';
import QueryResults from './components/QueryResults';
import './App.css';

interface DataState {
  columns: string[];
  data: any[];
  rowCount: number;
  preview: any[];
}

interface QueryResult {
  query: string;
  response: {
    answer: string;
    calculations: string;
    dataPoints: string;
    visualization: string;
  };
  analysis: any;
  timestamp: string;
}

function App() {
  const [dataState, setDataState] = useState<DataState | null>(null);
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (uploadResult: DataState) => {
    setDataState(uploadResult);
    setQueryResults([]); // Clear previous results
  };

  const handleQuerySubmit = (result: QueryResult) => {
    setQueryResults(prev => [result, ...prev]);
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      
      <header className="app-header">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Data Query Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Upload your Excel or CSV files and ask questions in plain English
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!dataState ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onUpload={handleFileUpload} setIsLoading={setIsLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Data Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Total Rows</div>
                  <div className="text-2xl font-bold text-blue-900">{dataState.rowCount}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Columns</div>
                  <div className="text-2xl font-bold text-green-900">{dataState.columns.length}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-600">File Type</div>
                  <div className="text-2xl font-bold text-purple-900">Uploaded</div>
                </div>
              </div>
              
              <button
                onClick={() => setDataState(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Upload New File
              </button>
            </div>

            {/* Query Interface */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <QueryInterface 
                columns={dataState.columns}
                onSubmit={handleQuerySubmit}
                setIsLoading={setIsLoading}
              />
            </div>

            {/* Data Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Preview
              </h2>
              <DataViewer data={dataState.preview} columns={dataState.columns} />
            </div>

            {/* Query Results */}
            {queryResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Query Results
                </h2>
                <QueryResults results={queryResults} />
              </div>
            )}
          </div>
        )}
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 