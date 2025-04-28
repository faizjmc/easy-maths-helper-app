
import React, { useState } from 'react';
import Workspace from './Workspace';
import SymbolGroup from './SymbolGroup';
import Settings from './Settings';
import TabNavigation from './TabNavigation';
import SymbolGroupNavigation from './SymbolGroupNavigation';
import { symbolGroups } from '../data/symbolGroups';

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
  
  // Handle symbol selection
  const handleSymbolSelect = (symbol: string) => {
    const newExpressions = [...expressions];
    if (!newExpressions[activeTab]) {
      newExpressions[activeTab] = [['']];
    }
    const targetTabExpressions = newExpressions[activeTab];
    const lastLineIndex = targetTabExpressions.length - 1;
    targetTabExpressions[lastLineIndex].push(symbol);
    setExpressions(newExpressions);
  };
  
  const handleAddTab = () => {
    const newTabId = tabs.length;
    setTabs([...tabs, { id: newTabId, name: `Tab ${newTabId + 1}` }]);
    const newExpressions = [...expressions];
    newExpressions[newTabId] = [['']];
    setExpressions(newExpressions);
    setActiveTab(newTabId);
  };
  
  const handleTabSelect = (tabId: number) => {
    setActiveTab(tabId);
  };
  
  const handleExpressionsChange = (tabId: number, newTabExpressions: string[][][]) => {
    const updatedExpressions = [...expressions];
    updatedExpressions[tabId] = newTabExpressions[tabId];
    setExpressions(updatedExpressions);
  };

  return (
    <div className={`p-4 ${highContrast ? 'bg-black text-white' : 'bg-mathPurple/5'}`}>
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-mathPurple-dark">Maths Scribe</h1>
        <p className="text-lg">Write math equations easily!</p>
      </header>
      
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        onAddTab={handleAddTab}
      />
      
      <Workspace 
        activeTabId={activeTab} 
        expressions={expressions} 
        onExpressionsChange={handleExpressionsChange} 
      />
      
      <SymbolGroupNavigation
        symbolGroups={symbolGroups}
        activeGroup={activeGroup}
        onGroupSelect={setActiveGroup}
      />
      
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
