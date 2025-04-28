
import React, { useState, useRef } from 'react';
import { Plus, Undo, Redo, ArrowDown } from 'lucide-react';

type WorkspaceProps = {
  activeTabId: number;
  expressions: string[][]; 
  onExpressionsChange: (tabId: number, expressions: string[][]) => void;
};

const Workspace: React.FC<WorkspaceProps> = ({ activeTabId, expressions, onExpressionsChange }) => {
  const [cursorPosition, setCursorPosition] = useState<{ line: number; char: number }>({ line: 0, char: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleAddLine = () => {
    const newExpressions = [...expressions];
    newExpressions[activeTabId] = [...newExpressions[activeTabId], ['']];
    onExpressionsChange(activeTabId, newExpressions);
    
    // Set cursor to beginning of new line
    const newLine = newExpressions[activeTabId].length - 1;
    setCursorPosition({ line: newLine, char: 0 });
  };

  const handleUndo = () => {
    // Undo logic would be implemented here
    console.log("Undo operation");
  };

  const handleRedo = () => {
    // Redo logic would be implemented here
    console.log("Redo operation");
  };

  const handleFocus = () => {
    // Focus the workspace area when clicked
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
            {/* Add cursor at end of line if needed */}
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
        <button
          onClick={handleAddLine}
          className="function-button bg-mathPurple/10 flex items-center gap-1"
          aria-label="Add new line"
        >
          <Plus size={20} />
          <span>Add Line</span>
        </button>
        <button 
          onClick={handleUndo}
          className="function-button"
          aria-label="Undo"
        >
          <Undo size={20} />
        </button>
        <button 
          onClick={handleRedo}
          className="function-button"
          aria-label="Redo"
        >
          <Redo size={20} />
        </button>
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
