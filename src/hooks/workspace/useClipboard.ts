
import { useState } from 'react';
import { useToast } from '../use-toast';
import { CursorPosition } from './useCursorPosition';

type UseClipboardProps = {
  expressions: string[][][];
  activeTabId: number;
  cursorPosition: CursorPosition;
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
  updateCursorPosition: (newPosition: CursorPosition) => void;
};

export const useClipboard = ({
  expressions,
  activeTabId,
  cursorPosition,
  onExpressionsChange,
  updateCursorPosition
}: UseClipboardProps) => {
  const [clipboard, setClipboard] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCut = () => {
    const currentExpressions = [...expressions];
    const currentLine = currentExpressions[activeTabId][cursorPosition.line];
    
    if (currentLine && currentLine.length > 0) {
      const cutContent = [...currentLine];
      setClipboard(cutContent);
      
      if (currentExpressions[activeTabId].length > 1) {
        currentExpressions[activeTabId].splice(cursorPosition.line, 1);
        updateCursorPosition({ 
          line: Math.min(cursorPosition.line, currentExpressions[activeTabId].length - 1), 
          char: 0 
        });
      } else {
        currentExpressions[activeTabId][0] = [''];
        updateCursorPosition({ line: 0, char: 0 });
      }
      
      onExpressionsChange(activeTabId, currentExpressions);
      
      toast({
        title: "Cut",
        description: "Content cut to clipboard",
      });
    }
  };
  
  const handleCopy = () => {
    const currentLine = expressions[activeTabId][cursorPosition.line];
    
    if (currentLine && currentLine.length > 0) {
      setClipboard([...currentLine]);
      
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    }
  };
  
  const handlePaste = () => {
    if (clipboard.length === 0) {
      toast({
        title: "Nothing to paste",
        description: "Clipboard is empty",
        variant: "destructive",
      });
      return;
    }
    
    const currentExpressions = [...expressions];
    const currentLine = [...currentExpressions[activeTabId][cursorPosition.line]];
    
    const newLine = [
      ...currentLine.slice(0, cursorPosition.char),
      ...clipboard,
      ...currentLine.slice(cursorPosition.char)
    ];
    
    currentExpressions[activeTabId][cursorPosition.line] = newLine;
    onExpressionsChange(activeTabId, currentExpressions);
    
    updateCursorPosition({
      ...cursorPosition,
      char: cursorPosition.char + clipboard.length
    });
    
    toast({
      title: "Pasted",
      description: "Content pasted from clipboard",
    });
  };
  
  const handleSelectAll = () => {
    if (expressions[activeTabId]?.length > 0) {
      // Mark all content as selected (position cursor at the end of all content)
      const lastLineIndex = expressions[activeTabId].length - 1;
      const lastLineLength = expressions[activeTabId][lastLineIndex]?.length || 0;
      
      updateCursorPosition({
        line: lastLineIndex,
        char: lastLineLength
      });
      
      toast({
        title: "Select All",
        description: "All content selected",
      });
    }
  };

  return {
    clipboard,
    handleCut,
    handleCopy,
    handlePaste,
    handleSelectAll
  };
};
