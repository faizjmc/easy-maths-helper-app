
import React from 'react';
import SymbolButton from './SymbolButton';

type SymbolGroupProps = {
  title: string;
  symbols: Array<{symbol: string; label?: string}>;
  onSymbolSelect: (symbol: string) => void;
  speakEnabled: boolean;
  colorClass?: string;
};

const SymbolGroup: React.FC<SymbolGroupProps> = ({ 
  title, 
  symbols, 
  onSymbolSelect,
  speakEnabled,
  colorClass = "bg-mathPurple/10" 
}) => {
  return (
    <div className="mb-4">
      <h3 className={`text-lg font-bold mb-2 px-3 py-2 rounded-lg ${colorClass}`}>{title}</h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {symbols.map((item) => (
          <SymbolButton
            key={item.symbol}
            symbol={item.symbol}
            label={item.label}
            onSymbolSelect={onSymbolSelect}
            speakEnabled={speakEnabled}
          />
        ))}
      </div>
    </div>
  );
};

export default SymbolGroup;
