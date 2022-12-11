// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBIUibvuj9WRhbgKuPImV4GS7G-qUTo4bM",
  authDomain: "stat-tracker.app",
  projectId: "player-stats-886f5",
  storageBucket: "player-stats-886f5.appspot.com",
  messagingSenderId: "1088164615490",
  appId: "1:1088164615490:web:8906c0d90f7254297064db",
  measurementId: "G-94Z1LZ673R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// auth
export const auth = getAuth(app);

//firestore db
export const db = getFirestore(app);

export default app;

