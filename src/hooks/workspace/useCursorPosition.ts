
import { useState, useEffect } from 'react';

type UseCursorPositionProps = {
  onCursorChange?: (position: {line: number, char: number}) => void;
};

export type CursorPosition = {
  line: number;
  char: number;
};

export const useCursorPosition = ({ onCursorChange }: UseCursorPositionProps) => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 0, char: 0 });

  // Sync cursor position with parent component
  useEffect(() => {
    if (onCursorChange) {
      onCursorChange(cursorPosition);
    }
  }, [cursorPosition, onCursorChange]);

  // Helper function to update cursor position and sync with parent
  const updateCursorPosition = (newPosition: CursorPosition) => {
    setCursorPosition(newPosition);
    if (onCursorChange) {
      onCursorChange(newPosition);
    }
  };

  return {
    cursorPosition,
    setCursorPosition,
    updateCursorPosition
  };
};
