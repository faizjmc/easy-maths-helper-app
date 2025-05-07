
import React, { forwardRef, KeyboardEvent } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type WorkspaceEditorProps = {
  expressions: string[][][];
  activeTabId: number;
  cursorPosition: { line: number; char: number };
  onFocus: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onSelectAll?: () => void;
};

const WorkspaceEditor = forwardRef<HTMLDivElement, WorkspaceEditorProps>(
  ({ expressions, activeTabId, cursorPosition, onFocus, onKeyDown, onCut, onCopy, onPaste, onSelectAll }, ref) => {
    const renderExpressions = () => {
      const currentTabExpressions = expressions[activeTabId] || [['']];
      
      return currentTabExpressions.map((line, lineIndex) => {
        // Join the line array into a single string for display
        const flatLine = line.join('');
        
        return (
          <div 
            key={lineIndex} 
            className="min-h-[36px] flex items-center text-2xl mb-2 font-mono relative"
          >
            {/* Only display cursor at beginning of line if this is the current position */}
            {/*
            cursorPosition.line === lineIndex && cursorPosition.char === 0 && (
              <span
                className="h-6 w-0.5 bg-mathPurple animate-pulse mr-0.5 font-bold"
                style={{ width: '1px' }}
              ></span>
            )
            */}

            {/* Render each character with potential cursor after it */}
            {flatLine.split('').map((char, i) => (
              <React.Fragment key={`char-${i}`}>
                <span className="inline-block">{char}</span>
                {/* Only show cursor after this character if this is the current position */}
                {cursorPosition.line === lineIndex && cursorPosition.char === i + 1 && (
                  <span
                    className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5 font-bold"
                    style={{ width: '2px' }}
                  ></span>
                )}
              </React.Fragment>
            ))}

            {/* Empty line case - show cursor if this is an empty line and it's the current position */}
            {flatLine.length === 0 && cursorPosition.line === lineIndex && cursorPosition.char === 0 && (
              <span
                className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5 font-bold"
                style={{ width: '3px' }}
              ></span>
            )}
          </div>
        );
      });
    };

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            ref={ref}
            className="workspace-area p-2 min-h-[150px] border border-dashed border-mathPurple/50 rounded-lg"
            tabIndex={0}
            onClick={onFocus}
            onKeyDown={onKeyDown}
            role="textbox"
            aria-label="Math workspace"
          >
            {renderExpressions()}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onCut} disabled={!onCut}>
            Cut
          </ContextMenuItem>
          <ContextMenuItem onClick={onCopy} disabled={!onCopy}>
            Copy
          </ContextMenuItem>
          <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
            Paste
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onSelectAll} disabled={!onSelectAll}>
            Select All
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

WorkspaceEditor.displayName = 'WorkspaceEditor';

export default WorkspaceEditor;
