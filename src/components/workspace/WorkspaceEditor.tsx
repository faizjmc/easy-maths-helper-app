
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
      return expressions[activeTabId]?.map((line, lineIndex) => (
        <div 
          key={lineIndex} 
          className="min-h-[36px] flex items-center text-2xl mb-2 font-mono"
        >
          {line.map((expr, charIndex) => (
            <React.Fragment key={`char-${charIndex}`}>
              {cursorPosition.line === lineIndex && cursorPosition.char === charIndex && (
                <span className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5 font-bold" style={{ width: '3px' }}></span>
              )}
              <span>{expr}</span>
            </React.Fragment>
          ))}
          {cursorPosition.line === lineIndex && cursorPosition.char === line.length && (
            <span className="h-6 w-0.5 bg-mathPurple animate-pulse mx-0.5 font-bold" style={{ width: '3px' }}></span>
          )}
        </div>
      ));
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
