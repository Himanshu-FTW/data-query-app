import React, { useState } from 'react';
import { Send, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface QueryInterfaceProps {
  columns: string[];
  onSubmit: (result: any) => void;
  setIsLoading: (loading: boolean) => void;
}

const QueryInterface: React.FC<QueryInterfaceProps> = ({ columns, onSubmit, setIsLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestedQueries] = useState([
    'What is the average value in the dataset?',
    'Show me the highest and lowest values',
    'How many rows are in the dataset?',
    'What are the unique values in each column?',
    'Can you summarize the data for me?'
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/query', { query: query.trim() });
      onSubmit(response.data);
      setQuery('');
      toast.success('Query processed successfully!');
    } catch (error: any) {
      console.error('Query error:', error);
      toast.error(error.response?.data?.error || 'Failed to process query');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ask Questions About Your Data
        </h3>
        <p className="text-sm text-gray-600">
          Use natural language to query your uploaded data. For example: "What is the average sales?", "Show me the top 5 products", etc.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What is the average sales for each region?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </div>
        </div>
      </form>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Suggested Questions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestedQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-left p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Available Columns</h4>
        <div className="flex flex-wrap gap-2">
          {columns.map((column, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
            >
              {column}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryInterface; 