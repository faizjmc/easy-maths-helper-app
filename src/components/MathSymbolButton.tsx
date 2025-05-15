
import React from 'react';
import { cn } from '@/lib/utils';

interface MathSymbolButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}

export const MathSymbolButton: React.FC<MathSymbolButtonProps> = ({ 
  children, 
  onClick, 
  active = false,
  className
}) => {
  return (
    <button 
      className={cn(
        "py-3 px-4 rounded-lg text-md font-medium transition-transform active:scale-95 min-w-[60px] min-h-[50px] flex items-center justify-center",
        active 
          ? "bg-purple-600 text-white hover:bg-purple-700"
          : "bg-white text-gray-800 hover:bg-gray-100 shadow-sm", 
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
