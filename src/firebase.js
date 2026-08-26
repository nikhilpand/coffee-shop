// Firebase Initialization and Services for Slow Pour
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-il5TUN0e5nPYxdmY-NyPodQEzprdjE0",
  authDomain: "nikhil-48617.firebaseapp.com",
  projectId: "nikhil-48617",
  storageBucket: "nikhil-48617.firebasestorage.app",
  messagingSenderId: "519273488124",
  appId: "1:519273488124:web:226622b55323608aee8179",
  measurementId: "G-YYWBT2C9H5"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore database (pointing to 'default' database)
export const db = getFirestore(app, 'default');
