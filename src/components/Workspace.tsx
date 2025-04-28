import React, { useState, useRef } from 'react';
import { Plus, Undo, Redo, Delete, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

type WorkspaceProps = {
  activeTabId: number;
  expressions: string[][][];
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
};

const Workspace: React.FC<WorkspaceProps> = ({ activeTabId, expressions, onExpressionsChange }) => {
  const [cursorPosition, setCursorPosition] = useState<{ line: number; char: number }>({ line: 0, char: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);

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

  const handleFocus = () => {
    if (workspaceRef.current) {
      workspaceRef.current.focus();
    }
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
              <span className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5"></span>
            )}
            <span>{expr}</span>
            {charIndex === line.length - 1 && cursorPosition.line === lineIndex && cursorPosition.char === line.length && (
              <span className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5"></span>
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
          className="function-button bg-mathPurple/10 flex items-center gap-1"
          aria-label="Add new line"
        >
          <Plus size={20} />
          <span>Add Line</span>
        </Button>
        <Button 
          onClick={() => onExpressionsChange(activeTabId, expressions)}
          className="function-button"
          aria-label="Undo"
        >
          <Undo size={20} />
        </Button>
        <Button 
          onClick={() => onExpressionsChange(activeTabId, expressions)}
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
          <Trash2 size={20} />
        </Button>
        <Button
          onClick={handleDelete}
          className="function-button"
          aria-label="Delete"
        >
          <Delete size={20} />
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
