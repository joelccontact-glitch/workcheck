// ====================================================================
// 다음정보시스템즈 PMO 구축 및 운영체계 (DaumIS PMO Portal) Firebase Studio Config
// Connected to user's dedicated Firebase Project: mypmo-6a2b7
// ====================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAZXh2TxtP4vdzATww7RqOvQxQe_XsKlYg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mypmo-6a2b7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mypmo-6a2b7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mypmo-6a2b7.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "795601612445",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:795601612445:web:172042fba359e50cdbae74"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database Instance
export const db = getFirestore(app);

export default app;
