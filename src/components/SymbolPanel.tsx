
import React from 'react';
import { MathSymbolButton } from './MathSymbolButton';
import { CategoryTab } from './CategoryTab';

interface SymbolPanelProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  handleSymbolClick: (symbol: string) => void;
  highContrast: boolean;
}

// Symbol category definitions
export const categories = [
  "Numbers",
  "Fractions",
  "Letters",
  "Basic Operations",
  "Comparisons",
  "Brackets",
  "Trigonometry",
  "Advanced",
  "Set Theory",
  "Calculus",
  "Greek Letters"
];

// Symbol sets for each category
export const numberSymbols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
export const fractionSymbols = ['½', '⅓', '⅔', '¼', '¾', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅐', '⅛', '⅜', '⅝', '⅞', '⁄'];
export const letterSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
export const operationSymbols = ['+', '-', '×', '÷', '=', '≠', '±'];
export const comparisonSymbols = ['<', '>', '≤', '≥', '≈', '∝'];
export const bracketSymbols = ['(', ')', '[', ']', '{', '}', '|'];
export const trigonometrySymbols = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot', '°', '′', '″'];
export const advancedSymbols = ['π', '√', '∛', '∜', '∞', '^', '!', 'Σ', 'Π'];
export const setTheorySymbols = ['∈', '∉', '⊂', '⊆', '∪', '∩', '∅', '∀', '∃'];
export const calculusSymbols = ['∫', '∂', '′', '″', '∇', 'lim', 'dx', 'dy'];
export const greekLetterSymbols = ['α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'σ', 'φ', 'Ω'];

export const SymbolPanel: React.FC<SymbolPanelProps> = ({ 
  activeCategory, 
  setActiveCategory, 
  handleSymbolClick,
  highContrast
}) => {
  // Get the appropriate symbols for the active category
  const getSymbolsForCategory = () => {
    switch(activeCategory) {
      case "Numbers": return numberSymbols;
      case "Fractions": return fractionSymbols;
      case "Letters": return letterSymbols;
      case "Basic Operations": return operationSymbols;
      case "Comparisons": return comparisonSymbols;
      case "Brackets": return bracketSymbols;
      case "Trigonometry": return trigonometrySymbols;
      case "Advanced": return advancedSymbols;
      case "Set Theory": return setTheorySymbols;
      case "Calculus": return calculusSymbols;
      case "Greek Letters": return greekLetterSymbols;
      default: return numberSymbols;
    }
  };

  const currentSymbols = getSymbolsForCategory();

  return (
    <>
      {/* Categories section - grid layout */}
      <div className="mb-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {categories.map((category) => (
            <CategoryTab 
              key={category}
              label={category}
              active={category === activeCategory}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Symbols section */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 mb-8">
        {currentSymbols.map((symbol) => (
          <MathSymbolButton 
            key={symbol} 
            onClick={() => handleSymbolClick(symbol)}
            className={highContrast ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}
          >
            {symbol}
          </MathSymbolButton>
        ))}
      </div>
    </>
  );
};
