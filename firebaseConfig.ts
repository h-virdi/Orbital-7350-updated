// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyANxT0TB-9bQezOP97Wum0mOLMUaAk8P3s',
  authDomain: 'syncourtrip20.firebaseapp.com',
  projectId: 'syncourtrip20',
  storageBucket: 'syncourtrip20.firebasestorage.app',
  messagingSenderId: '...',
  appId: '...'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Export Firestore instance
export const auth = getAuth(app);