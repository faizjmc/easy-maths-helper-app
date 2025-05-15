
import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryTabProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({ 
  label, 
  active = false, 
  onClick
}) => {
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
        active 
          ? "bg-purple-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
