
import { CursorPosition } from './useCursorPosition';

type UseNavigationProps = {
  expressions: string[][][];
  activeTabId: number;
  cursorPosition: CursorPosition;
  updateCursorPosition: (newPosition: CursorPosition) => void;
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
};

export const useNavigation = ({
  expressions,
  activeTabId,
  cursorPosition,
  updateCursorPosition,
  onExpressionsChange
}: UseNavigationProps) => {
  
  const handleAddLine = () => {
    const newExpressions = [...expressions];
    if (!newExpressions[activeTabId]) {
      newExpressions[activeTabId] = [['']];
    } else {
      newExpressions[activeTabId] = [...newExpressions[activeTabId], ['']];
    }
    onExpressionsChange(activeTabId, newExpressions);
    
    const newLine = newExpressions[activeTabId].length - 1;
    updateCursorPosition({ line: newLine, char: 0 });
  };

  const handleBackspace = () => {
    const currentExpressions = [...expressions];
    const currentLine = currentExpressions[activeTabId][cursorPosition.line];
    
    if (cursorPosition.char > 0) {
      currentLine.splice(cursorPosition.char - 1, 1);
      updateCursorPosition({ ...cursorPosition, char: cursorPosition.char - 1 });
    } else if (cursorPosition.line > 0) {
      const previousLine = currentExpressions[activeTabId][cursorPosition.line - 1];
      const newPosition = previousLine.length;
      previousLine.push(...currentLine);
      currentExpressions[activeTabId].splice(cursorPosition.line, 1);
      updateCursorPosition({ line: cursorPosition.line - 1, char: newPosition });
    }
    
    onExpressionsChange(activeTabId, currentExpressions);
  };

  const handleDelete = () => {
    const currentExpressions = [...expressions];
    const currentLine = currentExpressions[activeTabId][cursorPosition.line];
    
    if (cursorPosition.char < currentLine.length) {
      currentLine.splice(cursorPosition.char, 1);
    } else if (cursorPosition.line < currentExpressions[activeTabId].length - 1) {
      const nextLine = currentExpressions[activeTabId][cursorPosition.line + 1];
      currentLine.push(...nextLine);
      currentExpressions[activeTabId].splice(cursorPosition.line + 1, 1);
    }
    
    onExpressionsChange(activeTabId, currentExpressions);
  };

  const handleArrowKeys = (direction: 'left' | 'right' | 'up' | 'down') => {
    switch (direction) {
      case 'left':
        if (cursorPosition.char > 0) {
          updateCursorPosition({ ...cursorPosition, char: cursorPosition.char - 1 });
        } else if (cursorPosition.line > 0) {
          const previousLine = expressions[activeTabId][cursorPosition.line - 1];
          updateCursorPosition({ line: cursorPosition.line - 1, char: previousLine.length });
        }
        break;
        
      case 'right':
        const currentLine = expressions[activeTabId][cursorPosition.line];
        if (cursorPosition.char < currentLine.length) {
          updateCursorPosition({ ...cursorPosition, char: cursorPosition.char + 1 });
        } else if (cursorPosition.line < expressions[activeTabId].length - 1) {
          updateCursorPosition({ line: cursorPosition.line + 1, char: 0 });
        }
        break;
        
      case 'up':
        if (cursorPosition.line > 0) {
          const targetLine = expressions[activeTabId][cursorPosition.line - 1];
          const newChar = Math.min(cursorPosition.char, targetLine.length);
          updateCursorPosition({ line: cursorPosition.line - 1, char: newChar });
        }
        break;
        
      case 'down':
        if (cursorPosition.line < expressions[activeTabId].length - 1) {
          const targetLine = expressions[activeTabId][cursorPosition.line + 1];
          const newChar = Math.min(cursorPosition.char, targetLine.length);
          updateCursorPosition({ line: cursorPosition.line + 1, char: newChar });
        }
        break;
    }
  };

  return {
    handleAddLine,
    handleBackspace,
    handleDelete,
    handleArrowKeys
  };
};
