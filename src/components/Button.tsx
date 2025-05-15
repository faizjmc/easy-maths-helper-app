
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'default' | 'operation' | 'equals' | 'function';
  span?: number;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'default',
  span = 1
}) => {
  const baseClasses = "py-4 rounded-lg text-xl font-medium transition-transform active:scale-95 flex items-center justify-center";

  const typeClasses = {
    default: "bg-white text-gray-800 hover:bg-gray-200 shadow-sm",
    operation: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
    equals: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm",
    function: "bg-gray-300 text-gray-800 hover:bg-gray-400 shadow-sm"
  };

  return (
    <button 
      className={cn(
        baseClasses,
        typeClasses[type],
        span === 2 ? "col-span-2" : ""
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
