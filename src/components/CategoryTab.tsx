
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
        "px-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors text-center leading-tight min-h-[40px] flex items-center justify-center",
        active 
          ? "bg-purple-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <span className="break-words hyphens-auto">
        {label}
      </span>
    </button>
  );
};
