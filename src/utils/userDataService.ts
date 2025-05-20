
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/sonner';

// Define localStorage keys
const LOCAL_STORAGE_KEYS = {
  TABS: 'mathsScribe_tabs',
  TAB_NAMES: 'mathsScribe_tabNames',
  ACTIVE_TAB: 'mathsScribe_activeTab',
  TAB_COUNT: 'mathsScribe_tabCount',
  TEXT_TO_SPEECH: 'mathsScribe_textToSpeech',
  SYMBOL_SIZE: 'mathsScribe_symbolSize',
  HIGH_CONTRAST: 'mathsScribe_highContrast',
  PENDING_CHANGES: 'mathsScribe_pendingChanges'
};

export interface UserData {
  tabs: {
    tabData: { [key: string]: string };
    tabNames: { [key: string]: string };
    activeTab: string;
    tabCount: number;
  };
  settings: {
    textToSpeech: boolean;
    symbolSize: number;
    highContrast: boolean;
  };
  lastUpdated?: any; // Firestore timestamp
  createdAt?: any; // Firestore timestamp
}

// Helper function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Helper to check if the device is offline
const isOffline = () => {
  return !navigator.onLine;
};

// Store pending changes for sync when back online
const storePendingChanges = (userId: string, data: UserData) => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const pendingChanges = {
      userId,
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_CHANGES, JSON.stringify(pendingChanges));
    console.log('Stored pending changes for later sync');
  } catch (error) {
    console.error('Error storing pending changes:', error);
  }
};

// Process pending changes when back online
export const processPendingChanges = async () => {
  if (!isLocalStorageAvailable() || isOffline()) return;
  
  try {
    const pendingChangesString = localStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_CHANGES);
    if (!pendingChangesString) return;
    
    const pendingChanges = JSON.parse(pendingChangesString);
    if (pendingChanges && pendingChanges.userId && pendingChanges.data) {
      console.log('Processing pending changes from offline mode');
      await saveUserData(pendingChanges.userId, pendingChanges.data);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_CHANGES);
      toast("Synced", {
        description: "Your changes have been synced to the cloud",
      });
    }
  } catch (error) {
    console.error('Error processing pending changes:', error);
  }
};

// Set up online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online, syncing pending changes');
    processPendingChanges();
  });
}

// Get data from localStorage if available
export const getLocalUserData = (): UserData | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    // Get tab data
    const tabDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.TABS);
    const tabNamesString = localStorage.getItem(LOCAL_STORAGE_KEYS.TAB_NAMES);
    const activeTab = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB) || 'tab-1';
    const tabCountString = localStorage.getItem(LOCAL_STORAGE_KEYS.TAB_COUNT);
    
    // Get settings
    const textToSpeechString = localStorage.getItem(LOCAL_STORAGE_KEYS.TEXT_TO_SPEECH);
    const symbolSizeString = localStorage.getItem(LOCAL_STORAGE_KEYS.SYMBOL_SIZE);
    const highContrastString = localStorage.getItem(LOCAL_STORAGE_KEYS.HIGH_CONTRAST);
    
    const tabData = tabDataString ? JSON.parse(tabDataString) : { 'tab-1': '' };
    const tabNames = tabNamesString ? JSON.parse(tabNamesString) : { 'tab-1': 'Tab 1' };
    const tabCount = tabCountString ? parseInt(tabCountString, 10) : 1;
    
    const textToSpeech = textToSpeechString ? JSON.parse(textToSpeechString) : false;
    const symbolSize = symbolSizeString ? parseInt(symbolSizeString, 10) : 16;
    const highContrast = highContrastString ? JSON.parse(highContrastString) : false;
    
    // Check if we actually have any local data
    if (!tabDataString && !tabNamesString && !tabCountString) {
      return null;
    }
    
    return {
      tabs: {
        tabData,
        tabNames,
        activeTab,
        tabCount
      },
      settings: {
        textToSpeech,
        symbolSize,
        highContrast
      }
    };
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
    return null;
  }
};

// Clear local storage data
export const clearLocalUserData = () => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('Local user data cleared');
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};

// Save user data to local storage as backup
export const saveUserDataLocally = (data: UserData): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TABS, JSON.stringify(data.tabs.tabData));
    localStorage.setItem(LOCAL_STORAGE_KEYS.TAB_NAMES, JSON.stringify(data.tabs.tabNames));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, data.tabs.activeTab);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TAB_COUNT, data.tabs.tabCount.toString());
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEXT_TO_SPEECH, JSON.stringify(data.settings.textToSpeech));
    localStorage.setItem(LOCAL_STORAGE_KEYS.SYMBOL_SIZE, data.settings.symbolSize.toString());
    localStorage.setItem(LOCAL_STORAGE_KEYS.HIGH_CONTRAST, JSON.stringify(data.settings.highContrast));
    
    console.log('User data saved locally as backup');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const saveUserData = async (userId: string, data: UserData): Promise<void> => {
  try {
    if (isOffline()) {
      console.log('Device is offline. Saving data locally for later sync.');
      saveUserDataLocally(data);
      storePendingChanges(userId, data);
      return;
    }
    
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      lastUpdated: serverTimestamp()
    };
    
    const docRef = doc(db, 'userData', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // First time saving - add createdAt timestamp
      await setDoc(docRef, {
        ...dataWithTimestamps,
        createdAt: serverTimestamp()
      });
      console.log('User data created successfully');
    } else {
      // Update existing document
      await updateDoc(docRef, dataWithTimestamps);
      console.log('User data updated successfully');
    }
    
    // Also save locally as a backup
    saveUserDataLocally(data);
    
  } catch (error) {
    console.error('Error saving user data:', error);
    
    // Handle offline case or other errors
    if (isOffline() || (error as any)?.code === 'unavailable') {
      console.log('Device appears to be offline. Saving data locally for later sync.');
      saveUserDataLocally(data);
      storePendingChanges(userId, data);
      toast("Offline Mode", {
        description: "Changes saved locally and will sync when back online",
      });
    } else {
      toast("Error", {
        description: "Failed to save your work, but it's backed up locally",
      });
    }
  }
};

export const loadUserData = async (userId: string): Promise<UserData | null> => {
  try {
    if (isOffline()) {
      console.log('Device is offline. Loading from local storage.');
      const localData = getLocalUserData();
      if (localData) {
        toast("Offline Mode", {
          description: "Loaded data from local storage",
        });
        return localData;
      }
      return null;
    }
    
    const docRef = doc(db, 'userData', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('User data loaded successfully from Firestore');
      const userData = docSnap.data() as UserData;
      
      // Save to local storage as backup
      saveUserDataLocally(userData);
      
      return userData;
    } else {
      console.log('No user data found in Firestore');
      
      // Check for local data that might need migration
      const localData = getLocalUserData();
      if (localData) {
        console.log('Found local data, migrating to Firestore');
        await saveUserData(userId, localData);
        toast("Data Migrated", {
          description: "Your locally saved work has been migrated to the cloud",
        });
        
        // Clear local storage after successful migration
        clearLocalUserData();
        
        return localData;
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    
    // Try to fall back to local data
    const localData = getLocalUserData();
    if (localData) {
      toast("Offline Mode", {
        description: "Loaded from local backup due to connection issue",
      });
      return localData;
    }
    
    toast("Error", {
      description: "Failed to load your saved work",
    });
    return null;
  }
};
