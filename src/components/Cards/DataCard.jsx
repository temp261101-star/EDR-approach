import React from 'react';

const DataCard = ({ label, value, isLoading  }) => {
  return (
    <div className="rounded-lg cursor-pointer border bg-gray-800 p-3 shadow-sm hover:shadow-md transition-shadow border-gray-700 hover:border-gray-600">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-gray-400 font-medium">{label}</div>
      </div>
      <div className="flex items-end justify-between">
        {isLoading ? (
          <div className="text-xl font-bold text-gray-400">Loading...</div>
        ) : (
          <div className="text-xl font-bold text-gray-100">{value}</div>
        )}
      </div>
    </div>
  );
};

export default DataCard;