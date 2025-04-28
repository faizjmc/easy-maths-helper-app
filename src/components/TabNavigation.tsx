
import React from 'react';
import { Plus } from 'lucide-react';

type Tab = {
  id: number;
  name: string;
};

type TabNavigationProps = {
  tabs: Tab[];
  activeTab: number;
  onTabSelect: (tabId: number) => void;
  onAddTab: () => void;
};

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabSelect,
  onAddTab,
}) => {
  return (
    <div className="flex flex-wrap mb-2 border-b-2 border-mathPurple/50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button mr-1 ${activeTab === tab.id ? 'tab-button-active' : ''}`}
          onClick={() => onTabSelect(tab.id)}
        >
          {tab.name}
        </button>
      ))}
      <button 
        className="tab-button flex items-center gap-1 bg-mathPurple/5 font-bold"
        onClick={onAddTab}
        aria-label="Add new tab"
      >
        <Plus size={18} /> New Tab
      </button>
    </div>
  );
};

export default TabNavigation;
