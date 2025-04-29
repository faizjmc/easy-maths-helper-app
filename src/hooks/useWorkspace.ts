
import { useState, useRef } from 'react';
import { useToast } from './use-toast';

type UseWorkspaceProps = {
  activeTabId: number;
  expressions: string[][][];
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
  onUndo: () => void;
  onRedo: () => void;
};

type CursorPosition = {
  line: number;
  char: number;
};

export const useWorkspace = ({
  activeTabId,
  expressions,
  onExpressionsChange,
  onUndo,
  onRedo
}: UseWorkspaceProps) => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ line: 0, char: 0 });
  const [clipboard, setClipboard] = useState<string[]>([]);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleAddLine = () => {
    const newExpressions = [...expressions];
    if (!newExpressions[activeTabId]) {
      newExpressions[activeTabId] = [['']];
    } else {
      newExpressions[activeTabId] = [...newExpressions[activeTabId], ['']];
    }
    onExpressionsChange(activeTabId, newExpressions);
    
    const newLine = newExpressions[activeTabId].length - 1;
    setCursorPosition({ line: newLine, char: 0 });
  };

  const handleBackspace = () => {
    const currentExpressions = [...expressions];
    const currentLine = currentExpressions[activeTabId][cursorPosition.line];
    
    if (cursorPosition.char > 0) {
      currentLine.splice(cursorPosition.char - 1, 1);
      setCursorPosition({ ...cursorPosition, char: cursorPosition.char - 1 });
    } else if (cursorPosition.line > 0) {
      const previousLine = currentExpressions[activeTabId][cursorPosition.line - 1];
      const newPosition = previousLine.length;
      previousLine.push(...currentLine);
      currentExpressions[activeTabId].splice(cursorPosition.line, 1);
      setCursorPosition({ line: cursorPosition.line - 1, char: newPosition });
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

  const handleCut = () => {
    const currentExpressions = [...expressions];
    const currentLine = currentExpressions[activeTabId][cursorPosition.line];
    
    if (currentLine && currentLine.length > 0) {
      const cutContent = [...currentLine];
      setClipboard(cutContent);
      
      if (currentExpressions[activeTabId].length > 1) {
        currentExpressions[activeTabId].splice(cursorPosition.line, 1);
        setCursorPosition({ 
          line: Math.min(cursorPosition.line, currentExpressions[activeTabId].length - 1), 
          char: 0 
        });
      } else {
        currentExpressions[activeTabId][0] = [''];
        setCursorPosition({ line: 0, char: 0 });
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
    
    setCursorPosition({
      ...cursorPosition,
      char: cursorPosition.char + clipboard.length
    });
    
    toast({
      title: "Pasted",
      description: "Content pasted from clipboard",
    });
  };

  const handleFocus = () => {
    if (workspaceRef.current) {
      workspaceRef.current.focus();
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
    cursorPosition,
    clipboard,
    workspaceRef,
    handleAddLine,
    handleBackspace,
    handleDelete,
    handleCut,
    handleCopy,
    handlePaste,
    handleFocus,
    handleUndo,
    handleRedo
  };
};
