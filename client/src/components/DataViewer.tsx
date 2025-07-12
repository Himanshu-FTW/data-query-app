import React from 'react';

interface DataViewerProps {
  data: any[];
  columns: string[];
}

const DataViewer: React.FC<DataViewerProps> = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[column] !== undefined && row[column] !== null 
                    ? String(row[column]) 
                    : '-'
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length > 5 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing first 5 rows of {data.length} total rows
        </div>
      )}
    </div>
  );
};

export default DataViewer; 