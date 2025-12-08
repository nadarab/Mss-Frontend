import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJRf7WR8Hw55aTCCkNdflkvZgJ9qMZIMc",
  authDomain: "mss-project-57e93.firebaseapp.com",
  projectId: "mss-project-57e93",
  storageBucket: "mss-project-57e93.firebasestorage.app",
  messagingSenderId: "724496287534",
  appId: "1:724496287534:web:6f188c67faf97217231cbf",
  measurementId: "G-6WKF81JBN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Firestore (Database)
const db = getFirestore(app);

// Initialize Storage (for images/videos)
const storage = getStorage(app);

// Export for use in other files
export { app, analytics, db, storage };

