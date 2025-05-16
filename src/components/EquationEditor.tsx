
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { speakText } from '@/utils/textToSpeech';
import { TabManager } from './TabManager';
import { EquationTextArea } from './EquationTextArea';
import { SymbolPanel } from './SymbolPanel';
import { AccessibilitySettings } from './AccessibilitySettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const EquationEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tab-1");
  const [activeCategory, setActiveCategory] = useState("Numbers");
  const [tabData, setTabData] = useState<{ [key: string]: string }>({ "tab-1": "" });
  const [tabCount, setTabCount] = useState(1);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [symbolSize, setSymbolSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [tabNames, setTabNames] = useState<{ [key: string]: string }>({ "tab-1": "Tab 1" });
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState("");
  const [tabToDelete, setTabToDelete] = useState<string | null>(null);

  const handleSymbolClick = (symbol: string) => {
    const updatedEquation = tabData[activeTab] + symbol;
    setTabData(prev => ({ ...prev, [activeTab]: updatedEquation }));
    
    if (textToSpeech) {
      speakText(symbol, textToSpeech);
    }
  };

  const addNewTab = () => {
    const newTabCount = tabCount + 1;
    const newTabId = `tab-${newTabCount}`;
    setTabCount(newTabCount);
    setTabData(prev => ({ ...prev, [newTabId]: "" }));
    setTabNames(prev => ({ ...prev, [newTabId]: `Tab ${newTabCount}` }));
    setActiveTab(newTabId);
  };

  const deleteTab = (tabId: string) => {
    // Cannot delete the last remaining tab
    if (Object.keys(tabData).length <= 1) {
      return;
    }

    // Prepare for deletion
    setTabToDelete(tabId);
  };

  const confirmDeleteTab = () => {
    if (!tabToDelete) return;
    
    // Create new objects without the deleted tab
    const newTabData = { ...tabData };
    const newTabNames = { ...tabNames };
    
    delete newTabData[tabToDelete];
    delete newTabNames[tabToDelete];
    
    // Update state
    setTabData(newTabData);
    setTabNames(newTabNames);
    
    // If the deleted tab was active, switch to another tab
    if (activeTab === tabToDelete) {
      const remainingTabs = Object.keys(newTabData);
      if (remainingTabs.length > 0) {
        setActiveTab(remainingTabs[0]);
      }
    }
    
    // Clear the tabToDelete state
    setTabToDelete(null);
  };

  const cancelDeleteTab = () => {
    setTabToDelete(null);
  };

  const handleEquationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTabData(prev => ({ ...prev, [activeTab]: newValue }));
    
    // If text-to-speech is enabled and a new character was added, speak the last character
    if (textToSpeech && newValue.length > tabData[activeTab].length) {
      const lastChar = newValue.slice(tabData[activeTab].length);
      speakText(lastChar, textToSpeech);
    }
  };

  const startEditingTabName = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tab switching when clicking pencil
    setEditingTabId(tabId);
    setEditingTabName(tabNames[tabId]);
  };

  const saveTabName = () => {
    if (editingTabId) {
      // Don't allow empty names
      const newName = editingTabName.trim() || tabNames[editingTabId];
      setTabNames(prev => ({ ...prev, [editingTabId]: newName }));
      setEditingTabId(null);
    }
  };

  const handleTabNameInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTabName();
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto p-6 rounded-2xl shadow-xl ${highContrast ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {/* Alert Dialog for Delete Confirmation */}
      <AlertDialog open={tabToDelete !== null} onOpenChange={(isOpen) => !isOpen && setTabToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tab</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {tabToDelete ? tabNames[tabToDelete] : "this tab"}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteTab}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTab}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tabs section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabManager
          tabData={tabData}
          tabNames={tabNames}
          activeTab={activeTab}
          editingTabId={editingTabId}
          editingTabName={editingTabName}
          setActiveTab={setActiveTab}
          startEditingTabName={startEditingTabName}
          saveTabName={saveTabName}
          setEditingTabName={setEditingTabName}
          handleTabNameInputKeyDown={handleTabNameInputKeyDown}
          addNewTab={addNewTab}
          deleteTab={deleteTab}
          highContrast={highContrast}
        />

        {/* Tab contents */}
        {Object.keys(tabData).map((tabId) => (
          <TabsContent key={tabId} value={tabId}>
            <EquationTextArea
              value={tabData[tabId] || ""}
              onChange={handleEquationChange}
              isActive={tabId === activeTab}
              symbolSize={symbolSize}
              highContrast={highContrast}
            />

            <SymbolPanel
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              handleSymbolClick={handleSymbolClick}
              highContrast={highContrast}
            />

            <AccessibilitySettings
              textToSpeech={textToSpeech}
              setTextToSpeech={setTextToSpeech}
              symbolSize={symbolSize}
              setSymbolSize={setSymbolSize}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
