
import React from 'react';
import { Plus, Undo, Redo, Trash2, Trash, Copy, Clipboard, Scissors } from 'lucide-react';
import { Button } from '../ui/button';

type WorkspaceToolbarProps = {
  onAddLine: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onBackspace: () => void;
  onDelete: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
};

const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  onAddLine,
  onUndo,
  onRedo,
  onBackspace,
  onDelete,
  onCut,
  onCopy,
  onPaste
}) => {
  return (
    <div className="flex justify-end space-x-2 mb-4">
      <Button
        onClick={onAddLine}
        className="function-button bg-mathPurple/10 hover:bg-mathPurple/20 flex items-center gap-1"
        aria-label="Add new line"
      >
        <Plus size={20} />
        <span>Add Line</span>
      </Button>
      <Button 
        onClick={onUndo}
        className="function-button"
        aria-label="Undo"
      >
        <Undo size={20} />
      </Button>
      <Button 
        onClick={onRedo}
        className="function-button"
        aria-label="Redo"
      >
        <Redo size={20} />
      </Button>
      <Button
        onClick={onBackspace}
        className="function-button"
        aria-label="Backspace"
      >
        <Trash size={20} />
      </Button>
      <Button
        onClick={onDelete}
        className="function-button"
        aria-label="Delete"
      >
        <Trash2 size={20} />
      </Button>
      <Button
        onClick={onCut}
        className="function-button"
        aria-label="Cut"
      >
        <Scissors size={20} />
      </Button>
      <Button
        onClick={onCopy}
        className="function-button"
        aria-label="Copy"
      >
        <Copy size={20} />
      </Button>
      <Button
        onClick={onPaste}
        className="function-button"
        aria-label="Paste"
      >
        <Clipboard size={20} />
      </Button>
    </div>
  );
};

export default WorkspaceToolbar;
