
import React, { useState } from 'react';
import Workspace from './Workspace';
import SymbolGroup from './SymbolGroup';
import Settings from './Settings';
import TabNavigation from './TabNavigation';
import SymbolGroupNavigation from './SymbolGroupNavigation';
import { symbolGroups } from '../data/symbolGroups';
import { useExpressionHistory } from '../hooks/useExpressionHistory';
import { toast } from '../hooks/use-toast';

const MathScribe: React.FC = () => {
  // State for handling tabs
  const [tabs, setTabs] = useState([{ id: 0, name: "Tab 1" }]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Initialize expression history
  const { expressions, undo, redo, recordChange, canUndo, canRedo } = useExpressionHistory([
    [['']],  // Tab 0, initial empty expression
  ]);
  
  // Accessibility settings
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [highContrast, setHighContrast] = useState(false);
  
  // Symbol group navigation
  const [activeGroup, setActiveGroup] = useState('numbers');
  
  // Track cursor position for symbol insertion
  const [cursorPosition, setCursorPosition] = useState({ line: 0, char: 0 });
  
  // Handle symbol selection
  const handleSymbolSelect = (symbol: string) => {
    const newExpressions = [...expressions];
    if (!newExpressions[activeTab]) {
      newExpressions[activeTab] = [['']];
    }
    
    const currentLine = newExpressions[activeTab][cursorPosition.line];
    
    // Insert the symbol at the current cursor position
    currentLine.splice(cursorPosition.char, 0, symbol);
    
    recordChange(newExpressions);
    
    // Update cursor position to move after inserted symbol
    setCursorPosition({
      ...cursorPosition,
      char: cursorPosition.char + 1
    });
  };
  
  const handleAddTab = () => {
    const newTabId = tabs.length;
    setTabs([...tabs, { id: newTabId, name: `Tab ${newTabId + 1}` }]);
    const newExpressions = [...expressions];
    newExpressions[newTabId] = [['']];
    recordChange(newExpressions);
    setActiveTab(newTabId);
  };
  
  const handleTabSelect = (tabId: number) => {
    setActiveTab(tabId);
  };
  
  const handleRenameTab = (tabId: number, newName: string) => {
    const updatedTabs = tabs.map(tab => 
      tab.id === tabId ? { ...tab, name: newName } : tab
    );
    setTabs(updatedTabs);
    
    toast({
      title: "Tab Renamed",
      description: `Tab renamed to "${newName}"`,
    });
  };
  
  const handleExpressionsChange = (tabId: number, newExpressions: string[][][]) => {
    recordChange(newExpressions);
  };

  const handleCursorChange = (position: {line: number, char: number}) => {
    setCursorPosition(position);
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
    } else {
      toast({
        title: "Cannot Undo",
        description: "No more actions to undo",
        variant: "destructive",
      });
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
    } else {
      toast({
        title: "Cannot Redo",
        description: "No more actions to redo",
        variant: "destructive",
      });
    }
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
        onRenameTab={handleRenameTab}
      />
      
      <Workspace 
        activeTabId={activeTab} 
        expressions={expressions} 
        onExpressionsChange={handleExpressionsChange} 
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCursorChange={handleCursorChange} 
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
