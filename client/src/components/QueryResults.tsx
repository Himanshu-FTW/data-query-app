import React from 'react';
import { Clock, BarChart3, Calculator, Eye } from 'lucide-react';

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

interface QueryResultsProps {
  results: QueryResult[];
}

const QueryResults: React.FC<QueryResultsProps> = ({ results }) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getVisualizationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bar':
        return <BarChart3 className="w-4 h-4" />;
      case 'line':
        return <BarChart3 className="w-4 h-4" />;
      case 'pie':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white">
          {/* Query Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                "{result.query}"
              </h4>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatTimestamp(result.timestamp)}
              </div>
            </div>
          </div>

          {/* AI Response */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Analysis
            </h5>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">
                {result.response.answer}
              </p>
            </div>
          </div>

          {/* Calculations */}
          {result.response.calculations && result.response.calculations !== "Analysis completed" && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calculator className="w-4 h-4 mr-2" />
                Calculations
              </h5>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-900 whitespace-pre-wrap">
                  {result.response.calculations}
                </p>
              </div>
            </div>
          )}

          {/* Data Points */}
          {result.response.dataPoints && result.response.dataPoints !== "Data analyzed" && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Key Data Points
              </h5>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-900 whitespace-pre-wrap">
                  {result.response.dataPoints}
                </p>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {result.analysis && (
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Computed Results
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Summary */}
                {result.analysis.summary && Object.keys(result.analysis.summary).length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h6 className="text-sm font-medium text-purple-900 mb-2">Summary</h6>
                    <div className="space-y-1">
                      {Object.entries(result.analysis.summary).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-purple-700">{key.replace(/_/g, ' ')}:</span>
                          <span className="font-medium text-purple-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calculations */}
                {result.analysis.calculations && Object.keys(result.analysis.calculations).length > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h6 className="text-sm font-medium text-orange-900 mb-2">Calculations</h6>
                    <div className="space-y-1">
                      {Object.entries(result.analysis.calculations).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-orange-700">{key.replace(/_/g, ' ')}:</span>
                          <span className="font-medium text-orange-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visualization Suggestion */}
          {result.response.visualization && (
            <div className="flex items-center text-sm text-gray-600">
              {getVisualizationIcon(result.response.visualization)}
              <span className="ml-2">
                Suggested visualization: {result.response.visualization} chart
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QueryResults; 