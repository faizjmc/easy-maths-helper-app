
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
      await signInWithPopup(auth, googleProvider);
      toast("Success", {
        description: "You have successfully signed in",
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Provide more specific error message for unauthorized domain
      if (error.code === 'auth/unauthorized-domain') {
        toast("Authentication Error", {
          description: "This domain is not authorized for authentication. Please add it to your Firebase console.",
        });
        console.log("To fix this error, add this domain to authorized domains in Firebase console: ", window.location.hostname);
      } else {
        toast("Error", {
          description: "Failed to sign in with Google",
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
