
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
      { symbol: "0" }, { symbol: "1" }, { symbol: "2" }, { symbol: "3" }, 
      { symbol: "4" }, { symbol: "5" }, { symbol: "6" }, { symbol: "7" }, 
      { symbol: "8" }, { symbol: "9" }, { symbol: ".", label: "decimal point" },
      { symbol: ",", label: "comma" }
    ],
    color: "bg-mathYellow/30"
  },
  alphabets: {
    title: "Letters",
    symbols: [
      { symbol: "a" }, { symbol: "b" }, { symbol: "c" }, { symbol: "d" },
      { symbol: "f" }, { symbol: "g" }, { symbol: "h" }, { symbol: "i" },
      { symbol: "j" }, { symbol: "k" }, { symbol: "l" }, { symbol: "m" },
      { symbol: "n" }, { symbol: "o" }, { symbol: "p" }, { symbol: "q" },
      { symbol: "r" }, { symbol: "s" }, { symbol: "t" }, { symbol: "u" },
      { symbol: "v" }, { symbol: "w" }, { symbol: "x" }, { symbol: "y" },
      { symbol: "z" }, { symbol: "e", label: "euler's number" }
    ],
    color: "bg-mathBlue/30"
  },
  basicOperations: {
    title: "Basic Operations",
    symbols: [
      { symbol: "+", label: "plus" },
      { symbol: "-", label: "minus" },
      { symbol: "×", label: "multiply" },
      { symbol: "÷", label: "divide" },
      { symbol: "=", label: "equals" },
      { symbol: "≠", label: "not equal" },
      { symbol: "±", label: "plus minus" }
    ],
    color: "bg-mathGreen/30"
  },
  comparisons: {
    title: "Comparisons",
    symbols: [
      { symbol: "<", label: "less than" },
      { symbol: ">", label: "greater than" },
      { symbol: "≤", label: "less than or equal" },
      { symbol: "≥", label: "greater than or equal" },
      { symbol: "≈", label: "approximately equal" },
      { symbol: "∝", label: "proportional to" }
    ],
    color: "bg-mathOrange/30"
  },
  brackets: {
    title: "Brackets",
    symbols: [
      { symbol: "(", label: "open parenthesis" },
      { symbol: ")", label: "close parenthesis" },
      { symbol: "[", label: "open square bracket" },
      { symbol: "]", label: "close square bracket" },
      { symbol: "{", label: "open curly brace" },
      { symbol: "}", label: "close curly brace" },
      { symbol: "|", label: "absolute value" }
    ],
    color: "bg-mathPink/30"
  },
  trigonometry: {
    title: "Trigonometry",
    symbols: [
      { symbol: "sin", label: "sine" },
      { symbol: "cos", label: "cosine" },
      { symbol: "tan", label: "tangent" },
      { symbol: "csc", label: "cosecant" },
      { symbol: "sec", label: "secant" },
      { symbol: "cot", label: "cotangent" },
      { symbol: "°", label: "degrees" },
      { symbol: "′", label: "minutes" },
      { symbol: "″", label: "seconds" }
    ],
    color: "bg-mathOrange/30"
  },
  advanced: {
    title: "Advanced",
    symbols: [
      { symbol: "π", label: "pi" },
      { symbol: "√", label: "square root" },
      { symbol: "∛", label: "cube root" },
      { symbol: "∜", label: "fourth root" },
      { symbol: "∞", label: "infinity" },
      { symbol: "^", label: "power" },
      { symbol: "!", label: "factorial" },
      { symbol: "∑", label: "sum" },
      { symbol: "∏", label: "product" }
    ],
    color: "bg-mathPink/30"
  },
  setTheory: {
    title: "Set Theory",
    symbols: [
      { symbol: "∈", label: "element of" },
      { symbol: "∉", label: "not element of" },
      { symbol: "⊂", label: "subset" },
      { symbol: "⊆", label: "subset or equal" },
      { symbol: "∪", label: "union" },
      { symbol: "∩", label: "intersection" },
      { symbol: "∅", label: "empty set" },
      { symbol: "∀", label: "for all" },
      { symbol: "∃", label: "exists" }
    ],
    color: "bg-mathBlue/30"
  },
  calculus: {
    title: "Calculus",
    symbols: [
      { symbol: "∫", label: "integral" },
      { symbol: "∂", label: "partial derivative" },
      { symbol: "′", label: "prime" },
      { symbol: "″", label: "double prime" },
      { symbol: "∇", label: "nabla" },
      { symbol: "lim", label: "limit" },
      { symbol: "dx", label: "differential x" },
      { symbol: "dy", label: "differential y" }
    ],
    color: "bg-mathGreen/30"
  },
  greek: {
    title: "Greek Letters",
    symbols: [
      { symbol: "α", label: "alpha" },
      { symbol: "β", label: "beta" },
      { symbol: "γ", label: "gamma" },
      { symbol: "δ", label: "delta" },
      { symbol: "ε", label: "epsilon" },
      { symbol: "θ", label: "theta" },
      { symbol: "λ", label: "lambda" },
      { symbol: "μ", label: "mu" },
      { symbol: "σ", label: "sigma" },
      { symbol: "φ", label: "phi" },
      { symbol: "Ω", label: "omega" }
    ],
    color: "bg-mathYellow/30"
  }
};

