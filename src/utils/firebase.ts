// ====================================================================
// 다음정보시스템즈 PMO 구축 및 운영체계 (DaumIS PMO Portal) Firebase Studio Config
// ====================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDaumisPMOPortalStudio2026KeyMock",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "daumis-pmo-portal.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "daumis-pmo-portal",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "daumis-pmo-portal.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "109876543210",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:109876543210:web:daumispmo2026key"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore DB Instance
export const db = getFirestore(app);

export default app;
