
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
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
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
