
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
  HIGH_CONTRAST: 'mathsScribe_highContrast'
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

export const saveUserData = async (userId: string, data: UserData): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('Error saving user data:', error);
    toast("Error", {
      description: "Failed to save your work",
    });
  }
};

export const loadUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'userData', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('User data loaded successfully from Firestore');
      return docSnap.data() as UserData;
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
    toast("Error", {
      description: "Failed to load your saved work",
    });
    return null;
  }
};
