
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
};

const Workspace: React.FC<WorkspaceProps> = ({ 
  activeTabId, 
  expressions, 
  onExpressionsChange,
  onUndo,
  onRedo
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
    handleFocus,
    handleUndo,
    handleRedo
  } = useWorkspace({
    activeTabId,
    expressions,
    onExpressionsChange,
    onUndo,
    onRedo
  });

  return (
    <div className="border-2 border-mathPurple rounded-lg p-4 mb-4 bg-white h-[250px] md:h-[300px] overflow-auto">
      <WorkspaceToolbar
        onAddLine={handleAddLine}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onBackspace={handleBackspace}
        onDelete={handleDelete}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
      />
      
      <WorkspaceEditor
        ref={workspaceRef}
        expressions={expressions}
        activeTabId={activeTabId}
        cursorPosition={cursorPosition}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default Workspace;
