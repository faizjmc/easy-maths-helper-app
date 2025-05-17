
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Log the exact current domain for debugging
      console.log("Current domain attempting authentication:", window.location.hostname);

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
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
