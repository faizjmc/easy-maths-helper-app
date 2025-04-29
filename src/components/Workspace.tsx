
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Undo, Redo, Trash2, Backspace, Copy, Clipboard, Scissors } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

type WorkspaceProps = {
  activeTabId: number;
  expressions: string[][][];
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
  onUndo: () => void;
  onRedo: () => void;
};

const Workspace: React.FC<WorkspaceProps> = ({ 
  activeTabId, 
  expressions, 
  onExpressionsChange,
  onUndo,
  onRedo
}) => {
  const [cursorPosition, setCursorPosition] = useState<{ line: number; char: number }>({ line: 0, char: 0 });
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
    
    // Set cursor to beginning of new line
    const newLine = newExpressions[activeTabId].length - 1;
    setCursorPosition({ line: newLine, char: 0 });
  };

  const handleBackspace = () => {
    const currentExpressions = [...expressions];
    const currentLine = currentExpressions[activeTabId][cursorPosition.line];
    
    if (cursorPosition.char > 0) {
      // Remove character at current position
      currentLine.splice(cursorPosition.char - 1, 1);
      setCursorPosition({ ...cursorPosition, char: cursorPosition.char - 1 });
    } else if (cursorPosition.line > 0) {
      // Merge with previous line if at start of line
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
      // Remove character after cursor
      currentLine.splice(cursorPosition.char, 1);
    } else if (cursorPosition.line < currentExpressions[activeTabId].length - 1) {
      // Merge with next line if at end of line
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
      // Cut current line
      const cutContent = [...currentLine];
      setClipboard(cutContent);
      
      // Remove line
      if (currentExpressions[activeTabId].length > 1) {
        currentExpressions[activeTabId].splice(cursorPosition.line, 1);
        setCursorPosition({ 
          line: Math.min(cursorPosition.line, currentExpressions[activeTabId].length - 1), 
          char: 0 
        });
      } else {
        // If it's the only line, just clear it
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
    
    // Insert clipboard content at cursor position
    const newLine = [
      ...currentLine.slice(0, cursorPosition.char),
      ...clipboard,
      ...currentLine.slice(cursorPosition.char)
    ];
    
    currentExpressions[activeTabId][cursorPosition.line] = newLine;
    onExpressionsChange(activeTabId, currentExpressions);
    
    // Move cursor after pasted content
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

  // Helper function to render cursor at current position
  const renderExpressions = () => {
    return expressions[activeTabId]?.map((line, lineIndex) => (
      <div 
        key={lineIndex} 
        className="min-h-[36px] flex items-center text-2xl mb-2 font-mono"
      >
        {line.map((expr, charIndex) => (
          <React.Fragment key={charIndex}>
            {cursorPosition.line === lineIndex && cursorPosition.char === charIndex && (
              <span className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5 font-bold" style={{ width: '3px' }}></span>
            )}
            <span>{expr}</span>
            {charIndex === line.length - 1 && cursorPosition.line === lineIndex && cursorPosition.char === line.length && (
              <span className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5 font-bold" style={{ width: '3px' }}></span>
            )}
          </React.Fragment>
        ))}
      </div>
    ));
  };

  return (
    <div className="border-2 border-mathPurple rounded-lg p-4 mb-4 bg-white h-[250px] md:h-[300px] overflow-auto">
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          onClick={handleAddLine}
          className="function-button bg-mathPurple/10 hover:bg-mathPurple/20 flex items-center gap-1"
          aria-label="Add new line"
        >
          <Plus size={20} />
          <span>Add Line</span>
        </Button>
        <Button 
          onClick={handleUndo}
          className="function-button"
          aria-label="Undo"
        >
          <Undo size={20} />
        </Button>
        <Button 
          onClick={handleRedo}
          className="function-button"
          aria-label="Redo"
        >
          <Redo size={20} />
        </Button>
        <Button
          onClick={handleBackspace}
          className="function-button"
          aria-label="Backspace"
        >
          <Backspace size={20} />
        </Button>
        <Button
          onClick={handleDelete}
          className="function-button"
          aria-label="Delete"
        >
          <Trash2 size={20} />
        </Button>
        <Button
          onClick={handleCut}
          className="function-button"
          aria-label="Cut"
        >
          <Scissors size={20} />
        </Button>
        <Button
          onClick={handleCopy}
          className="function-button"
          aria-label="Copy"
        >
          <Copy size={20} />
        </Button>
        <Button
          onClick={handlePaste}
          className="function-button"
          aria-label="Paste"
        >
          <Clipboard size={20} />
        </Button>
      </div>
      
      <div 
        ref={workspaceRef}
        className="workspace-area p-2 min-h-[150px] border border-dashed border-mathPurple/50 rounded-lg"
        tabIndex={0}
        onClick={handleFocus}
        role="textbox"
        aria-label="Math workspace"
      >
        {renderExpressions()}
      </div>
    </div>
  );
};

export default Workspace;
