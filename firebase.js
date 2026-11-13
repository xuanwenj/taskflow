import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

// Replace this with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGgiDsf5ohdZpyP0Gr5B3nRwr8PD1DMk8",
  authDomain: "taskflow-5d179.firebaseapp.com",
  projectId: "taskflow-5d179",
  storageBucket: "taskflow-5d179.firebasestorage.app",
  messagingSenderId: "85345181593",
  appId: "1:85345181593:web:7b80fdd3322f5cefe77d08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

export { app, db };
