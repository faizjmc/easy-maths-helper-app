
import { KeyboardEvent } from 'react';
import { CursorPosition } from './useCursorPosition';
import { useNavigation } from './useNavigation';
import { useToast } from '../use-toast';

type UseTextInputProps = {
  expressions: string[][][];
  activeTabId: number;
  cursorPosition: CursorPosition;
  updateCursorPosition: (newPosition: CursorPosition) => void;
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
  onUndo: () => void;
  onRedo: () => void;
};

export const useTextInput = ({
  expressions,
  activeTabId,
  cursorPosition,
  updateCursorPosition,
  onExpressionsChange,
  onUndo,
  onRedo
}: UseTextInputProps) => {
  const { toast } = useToast();
  
  const {
    handleAddLine,
    handleBackspace,
    handleDelete,
    handleArrowKeys
  } = useNavigation({
    expressions,
    activeTabId,
    cursorPosition,
    updateCursorPosition,
    onExpressionsChange
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key to add a new line
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentExpressions = [...expressions];
      const currentLine = [...currentExpressions[activeTabId][cursorPosition.line]];
      const newLine = currentLine.slice(cursorPosition.char);
      currentExpressions[activeTabId][cursorPosition.line] = currentLine.slice(0, cursorPosition.char);
      currentExpressions[activeTabId].splice(cursorPosition.line + 1, 0, newLine);
      
      onExpressionsChange(activeTabId, currentExpressions);
      updateCursorPosition({ line: cursorPosition.line + 1, char: 0 });
      return;
    }

    // Handle Backspace key
    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }

    // Handle Delete key
    if (e.key === 'Delete') {
      e.preventDefault();
      handleDelete();
      return;
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleArrowKeys('left');
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleArrowKeys('right');
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleArrowKeys('up');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleArrowKeys('down');
      return;
    }

    // Handle regular text input (single character) - insert at cursor position
    if (e.key.length === 1) {
      e.preventDefault();
      
      const currentExpressions = JSON.parse(JSON.stringify(expressions)); // Deep copy to avoid state mutation issues
      if (!currentExpressions[activeTabId]) {
        currentExpressions[activeTabId] = [['']];
      }
      
      const currentLine = currentExpressions[activeTabId][cursorPosition.line];
      
      // Insert character at cursor position (left-to-right entry)
      currentLine.splice(cursorPosition.char, 0, e.key);
      onExpressionsChange(activeTabId, currentExpressions);
      
      // Move cursor one position to the right
      updateCursorPosition({
        ...cursorPosition,
        char: cursorPosition.char + 1
      });
    }
  };

  const handleUndo = () => {
    onUndo();
    toast({
      title: "Undone",
      description: "Previous state restored",
    });
  };

  const handleRedo = () => {
    onRedo();
    toast({
      title: "Redone",
      description: "Action restored",
    });
  };

  return {
    handleKeyDown,
    handleUndo,
    handleRedo
  };
};
