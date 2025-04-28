
import React, { useState, useEffect } from 'react';
import Workspace from './Workspace';
import SymbolGroup from './SymbolGroup';
import Settings from './Settings';
import { Plus } from 'lucide-react';

const MathScribe: React.FC = () => {
  // State for handling tabs
  const [tabs, setTabs] = useState([{ id: 0, name: "Tab 1" }]);
  const [activeTab, setActiveTab] = useState(0);
  
  // State for handling expressions (organized by tab)
  const [expressions, setExpressions] = useState<string[][][]>([
    [['']],  // Tab 0, initial empty expression
  ]);
  
  // Accessibility settings
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [highContrast, setHighContrast] = useState(false);
  
  // Symbol group navigation
  const [activeGroup, setActiveGroup] = useState('numbers');
  
  // Symbol definition groups
  const symbolGroups = {
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
  
  // Handle symbol selection
  const handleSymbolSelect = (symbol: string) => {
    // Add the symbol at current cursor position
    const newExpressions = [...expressions];
    if (!newExpressions[activeTab]) {
      newExpressions[activeTab] = [['']];
    }
    
    // For simplicity, always add to the end of the last line
    const targetTabExpressions = newExpressions[activeTab];
    const lastLineIndex = targetTabExpressions.length - 1;
    targetTabExpressions[lastLineIndex].push(symbol);
    
    setExpressions(newExpressions);
  };
  
  // Handle tab operations
  const handleAddTab = () => {
    const newTabId = tabs.length;
    setTabs([...tabs, { id: newTabId, name: `Tab ${newTabId + 1}` }]);
    
    // Create empty expression for new tab
    const newExpressions = [...expressions];
    newExpressions[newTabId] = [['']];
    setExpressions(newExpressions);
    
    // Activate the new tab
    setActiveTab(newTabId);
  };
  
  const handleTabSelect = (tabId: number) => {
    setActiveTab(tabId);
  };
  
  // Handle expressions change from workspace
  const handleExpressionsChange = (tabId: number, newTabExpressions: string[][][]) => {
    const updatedExpressions = [...expressions];
    updatedExpressions[tabId] = newTabExpressions[tabId]; // Update just the expressions for the active tab
    setExpressions(updatedExpressions);
  };

  // Apply high contrast if enabled
  const getSymbolButtonStyle = () => {
    return highContrast ? 'border-black bg-yellow-200 text-black' : '';
  };

  // Component styles based on accessibility settings
  useEffect(() => {
    // Apply font size to symbol buttons
    const style = document.createElement('style');
    style.innerHTML = `
      .symbol-button {
        font-size: ${fontSize}px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [fontSize]);

  return (
    <div className={`p-4 ${highContrast ? 'bg-black text-white' : 'bg-mathPurple/5'}`}>
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-mathPurple-dark">Maths Scribe</h1>
        <p className="text-lg">Write math equations easily!</p>
      </header>
      
      {/* Tab navigation */}
      <div className="flex flex-wrap mb-2 border-b-2 border-mathPurple/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button mr-1 ${activeTab === tab.id ? 'tab-button-active' : ''}`}
            onClick={() => handleTabSelect(tab.id)}
          >
            {tab.name}
          </button>
        ))}
        <button 
          className="tab-button flex items-center gap-1 bg-mathPurple/5 font-bold"
          onClick={handleAddTab}
          aria-label="Add new tab"
        >
          <Plus size={18} /> New Tab
        </button>
      </div>
      
      {/* Workspace area */}
      <Workspace 
        activeTabId={activeTab} 
        expressions={expressions} 
        onExpressionsChange={handleExpressionsChange} 
      />
      
      {/* Symbol group navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(symbolGroups).map(([key, group]) => (
          <button
            key={key}
            className={`symbol-group-button ${activeGroup === key ? 'symbol-group-button-active' : ''}`}
            onClick={() => setActiveGroup(key)}
          >
            {group.title}
          </button>
        ))}
      </div>
      
      {/* Active symbol group */}
      {Object.entries(symbolGroups).map(([key, group]) => (
        activeGroup === key && (
          <SymbolGroup
            key={key}
            title={group.title}
            symbols={group.symbols}
            onSymbolSelect={handleSymbolSelect}
            speakEnabled={speakEnabled}
            colorClass={group.color}
          />
        )
      ))}
      
      {/* Settings */}
      <div className="mt-6">
        <Settings
          speakEnabled={speakEnabled}
          onSpeakEnabledChange={setSpeakEnabled}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          highContrast={highContrast}
          onHighContrastChange={setHighContrast}
        />
      </div>
    </div>
  );
};

export default MathScribe;
