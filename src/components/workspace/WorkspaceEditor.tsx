
import React, { forwardRef } from 'react';

type WorkspaceEditorProps = {
  expressions: string[][][];
  activeTabId: number;
  cursorPosition: { line: number; char: number };
  onFocus: () => void;
};

const WorkspaceEditor = forwardRef<HTMLDivElement, WorkspaceEditorProps>(
  ({ expressions, activeTabId, cursorPosition, onFocus }, ref) => {
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
      <div 
        ref={ref}
        className="workspace-area p-2 min-h-[150px] border border-dashed border-mathPurple/50 rounded-lg"
        tabIndex={0}
        onClick={onFocus}
        role="textbox"
        aria-label="Math workspace"
      >
        {renderExpressions()}
      </div>
    );
  }
);

WorkspaceEditor.displayName = 'WorkspaceEditor';

export default WorkspaceEditor;
