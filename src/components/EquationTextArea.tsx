import React, { useRef, useEffect } from 'react';

interface EquationTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isActive: boolean;
  symbolSize: number;
  highContrast: boolean;
}

export const EquationTextArea: React.FC<EquationTextAreaProps> = ({
  value,
  onChange,
  isActive,
  symbolSize,
  highContrast
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Keep cursor visible at the end on input
  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
      // Place cursor at the end
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [value, isActive]);

  return (
    <div className="mb-6">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        className={`w-full h-40 p-4 border-2 border-dotted rounded-lg text-xl focus:outline-none ${
          highContrast
            ? 'bg-gray-700 text-white border-purple-500 focus:border-purple-600'
            : 'border-purple-400 focus:border-purple-600 text-gray-800'
        }`}
        placeholder="Write your equation here..."
        style={{ fontSize: `${symbolSize}px` }}
      />
    </div>
  );
};
