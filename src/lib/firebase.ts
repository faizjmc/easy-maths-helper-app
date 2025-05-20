
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAa3oS_xUdsUhj3yokayP4Tl-TQaCsuuU",
  authDomain: "easy-maths-helper-app.firebaseapp.com",
  projectId: "easy-maths-helper-app",
  storageBucket: "easy-maths-helper-app.firebasestorage.app",
  messagingSenderId: "508840638966",
  appId: "1:508840638966:web:f0dd73c6583eec45462fd7",
  measurementId: "G-FXMS1Z6GCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase persistence could not be enabled. Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    }
  });

// Log Firebase configuration for debugging
console.log("Firebase initialized with auth domain:", firebaseConfig.authDomain);

export default app;
