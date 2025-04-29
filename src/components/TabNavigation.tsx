
import React, { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Input } from './ui/input';

type Tab = {
  id: number;
  name: string;
};

type TabNavigationProps = {
  tabs: Tab[];
  activeTab: number;
  onTabSelect: (tabId: number) => void;
  onAddTab: () => void;
  onRenameTab?: (tabId: number, newName: string) => void;
};

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabSelect,
  onAddTab,
  onRenameTab,
}) => {
  const [editingTabId, setEditingTabId] = useState<number | null>(null);
  const [newTabName, setNewTabName] = useState<string>('');

  const handleStartRename = (tabId: number, currentName: string) => {
    setEditingTabId(tabId);
    setNewTabName(currentName);
  };

  const handleFinishRename = () => {
    if (editingTabId !== null && onRenameTab && newTabName.trim()) {
      onRenameTab(editingTabId, newTabName.trim());
    }
    setEditingTabId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishRename();
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  return (
    <div className="flex flex-wrap mb-2 border-b-2 border-mathPurple/50">
      {tabs.map((tab) => (
        <div key={tab.id} className="flex items-center">
          {editingTabId === tab.id ? (
            <Input
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              onBlur={handleFinishRename}
              onKeyDown={handleKeyDown}
              className="w-24 mr-1 h-8 px-2"
              autoFocus
            />
          ) : (
            <button
              className={`tab-button flex items-center justify-between gap-2 mr-1 ${activeTab === tab.id ? 'tab-button-active' : ''}`}
              onClick={() => onTabSelect(tab.id)}
            >
              <span>{tab.name}</span>
              <Pencil 
                size={14} 
                className="opacity-50 hover:opacity-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartRename(tab.id, tab.name);
                }}
              />
            </button>
          )}
        </div>
      ))}
      <button 
        className="tab-button flex items-center gap-1 bg-mathPurple/5 hover:bg-mathPurple/10 font-bold"
        onClick={onAddTab}
        aria-label="Add new tab"
      >
        <Plus size={18} /> New Tab
      </button>
    </div>
  );
};

export default TabNavigation;
