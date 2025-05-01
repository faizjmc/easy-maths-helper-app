
import { useRef } from 'react';
import { KeyboardEvent } from 'react';
import { useCursorPosition } from './workspace/useCursorPosition';
import { useClipboard } from './workspace/useClipboard';
import { useTextInput } from './workspace/useTextInput';

type UseWorkspaceProps = {
  activeTabId: number;
  expressions: string[][][];
  onExpressionsChange: (tabId: number, expressions: string[][][]) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCursorChange?: (position: {line: number, char: number}) => void;
};

export const useWorkspace = ({
  activeTabId,
  expressions,
  onExpressionsChange,
  onUndo,
  onRedo,
  onCursorChange
}: UseWorkspaceProps) => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  
  const { 
    cursorPosition, 
    updateCursorPosition 
  } = useCursorPosition({ onCursorChange });
  
  const { 
    clipboard, 
    handleCut, 
    handleCopy, 
    handlePaste,
    handleSelectAll 
  } = useClipboard({ 
    expressions, 
    activeTabId, 
    cursorPosition, 
    onExpressionsChange, 
    updateCursorPosition 
  });

  const { 
    handleKeyDown,
    handleUndo,
    handleRedo
  } = useTextInput({
    expressions,
    activeTabId,
    cursorPosition,
    updateCursorPosition,
    onExpressionsChange,
    onUndo,
    onRedo
  });

  const handleFocus = () => {
    if (workspaceRef.current) {
      workspaceRef.current.focus();
    }
  };

  return {
    cursorPosition,
    clipboard,
    workspaceRef,
    handleAddLine: () => {}, // This function was internal and not directly exported in original useWorkspace
    handleBackspace: () => {}, // This function was internal and not directly exported in original useWorkspace
    handleDelete: () => {}, // This function was internal and not directly exported in original useWorkspace
    handleCut,
    handleCopy,
    handlePaste,
    handleSelectAll,
    handleFocus,
    handleKeyDown,
    handleUndo,
    handleRedo
  };
};
