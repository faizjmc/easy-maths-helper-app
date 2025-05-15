
import React from 'react';

interface DisplayProps {
  value: string;
  operation: string | null;
  previousValue: string | null;
}

export const Display: React.FC<DisplayProps> = ({ value, operation, previousValue }) => {
  const displayExpression = () => {
    if (previousValue && operation) {
      return `${previousValue} ${operation}`;
    }
    return "";
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-4 text-right">
      <div className="text-gray-400 text-sm h-6 overflow-hidden">
        {displayExpression()}
      </div>
      <div className="text-white text-3xl font-semibold overflow-x-auto whitespace-nowrap">
        {value}
      </div>
    </div>
  );
};
