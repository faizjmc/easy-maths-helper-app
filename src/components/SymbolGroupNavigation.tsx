
import React from 'react';
import { SymbolGroups } from '../data/symbolGroups';

type SymbolGroupNavigationProps = {
  symbolGroups: SymbolGroups;
  activeGroup: string;
  onGroupSelect: (groupKey: string) => void;
};

const SymbolGroupNavigation: React.FC<SymbolGroupNavigationProps> = ({
  symbolGroups,
  activeGroup,
  onGroupSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Object.entries(symbolGroups).map(([key, group]) => (
        <button
          key={key}
          className={`symbol-group-button ${activeGroup === key ? 'symbol-group-button-active' : ''}`}
          onClick={() => onGroupSelect(key)}
        >
          {group.title}
        </button>
      ))}
    </div>
  );
};

export default SymbolGroupNavigation;
