
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ArrowRight, 
  Scissors, 
  Copy, 
  Clipboard, 
  TextCursor,
  Trash
} from 'lucide-react';

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
    <div className="flex flex-wrap gap-1 mb-2 items-center">
      <Button
        variant="outline" 
        size="sm" 
        onClick={onAddLine}
        className="text-xs"
      >
        <TextCursor className="h-4 w-4 mr-1" /> Add Line
      </Button>
      <Button variant="outline" size="sm" onClick={onUndo}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onRedo}>
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onBackspace}>
        Backspace
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onCut}>
        <Scissors className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onCopy}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onPaste}>
        <Clipboard className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WorkspaceToolbar;
