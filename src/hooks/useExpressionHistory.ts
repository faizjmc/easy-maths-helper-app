
import { useState } from 'react';

type HistoryState = {
  past: string[][][][];
  present: string[][][];
  future: string[][][][];
};

export const useExpressionHistory = (initialPresent: string[][][]) => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const undo = () => {
    const { past, present, future } = history;
    if (past.length === 0) return history.present;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setHistory({
      past: newPast,
      present: previous,
      future: [present, ...future],
    });

    return previous;
  };

  const redo = () => {
    const { past, present, future } = history;
    if (future.length === 0) return history.present;

    const next = future[0];
    const newFuture = future.slice(1);

    setHistory({
      past: [...past, present],
      present: next,
      future: newFuture,
    });

    return next;
  };

  const recordChange = (newPresent: string[][][]) => {
    setHistory({
      past: [...history.past, history.present],
      present: newPresent,
      future: [],
    });
  };

  return {
    expressions: history.present,
    undo,
    redo,
    recordChange,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  };
};
