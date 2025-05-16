
import React, { useRef, useEffect } from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { Input } from '@/components/ui/input';

interface TabManagerProps {
  tabData: { [key: string]: string };
  tabNames: { [key: string]: string };
  activeTab: string;
  editingTabId: string | null;
  editingTabName: string;
  setActiveTab: (tabId: string) => void;
  startEditingTabName: (tabId: string, e: React.MouseEvent) => void;
  saveTabName: () => void;
  setEditingTabName: (name: string) => void;
  handleTabNameInputKeyDown: (e: React.KeyboardEvent) => void;
  addNewTab: () => void;
  deleteTab: (tabId: string) => void;
  highContrast: boolean;
}

export const TabManager: React.FC<TabManagerProps> = ({
  tabData,
  tabNames,
  activeTab,
  editingTabId,
  editingTabName,
  setActiveTab,
  startEditingTabName,
  saveTabName,
  setEditingTabName,
  handleTabNameInputKeyDown,
  addNewTab,
  deleteTab,
  highContrast
}) => {
  const tabInputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when editing tab name
  useEffect(() => {
    if (editingTabId && tabInputRef.current) {
      tabInputRef.current.focus();
    }
  }, [editingTabId]);

  return (
    <div className="flex items-center border-b pb-2 mb-4 overflow-x-auto">
      <TabsList className={highContrast ? 'bg-gray-700' : 'bg-gray-100'}>
        {Object.keys(tabData).map((tabId) => (
          <TabsTrigger 
            key={tabId} 
            value={tabId} 
            className={`flex items-center gap-1 ${highContrast ? 'data-[state=active]:bg-purple-700 data-[state=active]:text-white' : ''}`}
          >
            {editingTabId === tabId ? (
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <Input
                  ref={tabInputRef}
                  value={editingTabName}
                  onChange={(e) => setEditingTabName(e.target.value)}
                  onKeyDown={handleTabNameInputKeyDown}
                  onBlur={saveTabName}
                  className="h-6 w-24 px-1 py-0 text-xs"
                />
                <Check size={14} className="ml-1 cursor-pointer" onClick={saveTabName} />
              </div>
            ) : (
              <>
                <span>{tabNames[tabId]}</span>
                <button 
                  onClick={(e) => startEditingTabName(tabId, e)} 
                  className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Check size={12} />
                </button>
                {Object.keys(tabData).length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTab(tabId);
                    }} 
                    className="ml-1 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <X size={12} className="text-red-500" />
                  </button>
                )}
              </>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      <button 
        onClick={addNewTab}
        className={`ml-2 flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
          highContrast 
            ? 'bg-purple-700 text-white hover:bg-purple-800' 
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        }`}
      >
        <span className="text-lg leading-none">+</span>
        New Tab
      </button>
    </div>
  );
};
