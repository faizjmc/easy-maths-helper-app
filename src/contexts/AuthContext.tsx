
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { toast } from "@/components/ui/sonner";
import { processPendingChanges } from '@/utils/userDataService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isOnline: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Set up online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast("Connected", {
        description: "You're back online. Syncing your data...",
      });
      
      // Process any pending changes
      if (currentUser) {
        processPendingChanges();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast("Offline Mode", {
        description: "You're now offline. Changes will be saved locally.",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser]);
  
  // Set up the Firebase auth state listener only once when component mounts
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      setCurrentUser(user);
      setLoading(false);
      
      // If we're online and user is logged in, check for pending changes
      if (user && navigator.onLine) {
        processPendingChanges();
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log("Attempting Google sign-in");
      await signInWithPopup(auth, googleProvider);
      toast("Success", {
        description: "You have successfully signed in",
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Provide more specific error message for unauthorized domain
      if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        toast("Authentication Error", {
          description: `Domain "${currentDomain}" is not authorized. Please add it to your Firebase console.`,
        });
        console.log("IMPORTANT - Add this EXACT domain to Firebase authorized domains:", currentDomain);
        console.log("Firebase Console Authentication Settings URL:", "https://console.firebase.google.com/project/easy-maths-helper-app/authentication/settings");
      } else {
        toast("Error", {
          description: "Failed to sign in with Google: " + (error.message || "Unknown error"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast("Success", {
        description: "You have been signed out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast("Error", {
        description: "Failed to sign out",
      });
    }
  };

  const value = {
    currentUser,
    loading,
    isOnline,
    signInWithGoogle,
    logout
  };

  // Render children directly, simpler approach
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
