
import React from 'react';
import WorkspaceToolbar from './workspace/WorkspaceToolbar';
import WorkspaceEditor from './workspace/WorkspaceEditor';
import { useWorkspace } from '../hooks/useWorkspace';

type WorkspaceProps = {
  activeTabId: number;
  expressions: string[][][];
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCursorChange: (position: {line: number, char: number}) => void;
};

const Workspace: React.FC<WorkspaceProps> = ({ 
  activeTabId, 
  expressions, 
  onExpressionsChange,
  onUndo,
  onRedo,
  onCursorChange
}) => {
  const {
    cursorPosition,
    clipboard,
    workspaceRef,
    handleAddLine,
    handleBackspace,
    handleDelete,
    handleCut,
    handleCopy,
    handlePaste,
    handleSelectAll,
    handleFocus,
    handleKeyDown,
    handleUndo,
    handleRedo
  } = useWorkspace({
    activeTabId,
    expressions,
    onExpressionsChange,
    onUndo,
    onRedo,
    onCursorChange
  });

  return (
    <div className="border-2 border-mathPurple rounded-lg p-4 mb-4 bg-white h-[250px] md:h-[300px] overflow-auto">
      <WorkspaceToolbar />
      
      <WorkspaceEditor
        ref={workspaceRef}
        expressions={expressions}
        activeTabId={activeTabId}
        cursorPosition={cursorPosition}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
};

export default Workspace;
