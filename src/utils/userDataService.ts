
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/sonner';

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
}

export const saveUserData = async (userId: string, data: UserData): Promise<void> => {
  try {
    await setDoc(doc(db, 'userData', userId), data);
    console.log('User data saved successfully');
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
      console.log('User data loaded successfully');
      return docSnap.data() as UserData;
    } else {
      console.log('No user data found');
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
