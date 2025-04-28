
import React from 'react';
import { useToast } from '@/components/ui/use-toast';

type SymbolButtonProps = {
  symbol: string;
  label?: string;
  className?: string;
  onSymbolSelect: (symbol: string) => void;
  speakEnabled: boolean;
};

const SymbolButton: React.FC<SymbolButtonProps> = ({ 
  symbol, 
  label, 
  className = '', 
  onSymbolSelect,
  speakEnabled
}) => {
  const { toast } = useToast();
  
  const handleClick = () => {
    onSymbolSelect(symbol);
    
    // Text-to-speech for accessibility
    if (speakEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(label || symbol);
      window.speechSynthesis.speak(utterance);
    }
    
    // Visual feedback via toast for special symbols
    if (["sin", "cos", "tan", "π", "√", "∞"].includes(symbol)) {
      toast({
        description: `Added ${label || symbol}`,
        duration: 1500,
      });
    }
  };

  return (
    <button
      className={`symbol-button ${className}`}
      onClick={handleClick}
      aria-label={label || symbol}
    >
      {symbol}
    </button>
  );
};

export default SymbolButton;
