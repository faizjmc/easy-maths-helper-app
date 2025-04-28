
export type SymbolGroupData = {
  title: string;
  symbols: Array<{ symbol: string; label?: string }>;
  color: string;
};

export type SymbolGroups = Record<string, SymbolGroupData>;

export const symbolGroups: SymbolGroups = {
  numbers: {
    title: "Numbers",
    symbols: [
      { symbol: "0" },
      { symbol: "1" },
      { symbol: "2" },
      { symbol: "3" },
      { symbol: "4" },
      { symbol: "5" },
      { symbol: "6" },
      { symbol: "7" },
      { symbol: "8" },
      { symbol: "9" },
    ],
    color: "bg-mathYellow/30"
  },
  alphabets: {
    title: "Letters",
    symbols: [
      { symbol: "a" },
      { symbol: "b" },
      { symbol: "c" },
      { symbol: "x" },
      { symbol: "y" },
      { symbol: "z" },
      { symbol: "A" },
      { symbol: "B" },
      { symbol: "C" },
      { symbol: "X" },
      { symbol: "Y" },
      { symbol: "Z" },
    ],
    color: "bg-mathBlue/30"
  },
  operations: {
    title: "Operations",
    symbols: [
      { symbol: "+", label: "plus" },
      { symbol: "-", label: "minus" },
      { symbol: "×", label: "multiply" },
      { symbol: "÷", label: "divide" },
      { symbol: "=", label: "equals" },
      { symbol: "<", label: "less than" },
      { symbol: ">", label: "greater than" },
      { symbol: "(", label: "open bracket" },
      { symbol: ")", label: "close bracket" },
      { symbol: ".", label: "decimal point" },
    ],
    color: "bg-mathGreen/30"
  },
  trigonometry: {
    title: "Trigonometry",
    symbols: [
      { symbol: "sin", label: "sine" },
      { symbol: "cos", label: "cosine" },
      { symbol: "tan", label: "tangent" },
      { symbol: "°", label: "degrees" },
    ],
    color: "bg-mathOrange/30"
  },
  advanced: {
    title: "Advanced",
    symbols: [
      { symbol: "π", label: "pi" },
      { symbol: "√", label: "square root" },
      { symbol: "∞", label: "infinity" },
      { symbol: "^", label: "power" },
      { symbol: "!", label: "factorial" },
    ],
    color: "bg-mathPink/30"
  },
};
