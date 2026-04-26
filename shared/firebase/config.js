import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjK4wM_AQyT5juuOoyyw-5fW2j9QktDd4",
  authDomain: "scarlution.firebaseapp.com",
  projectId: "scarlution",
  storageBucket: "scarlution.firebasestorage.app",
  messagingSenderId: "316028004894",
  appId: "1:316028004894:web:74eb65d1ff38057dcadc0f",
  measurementId: "G-VDDL4FPLFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);
const auth = getAuth(app);
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, db, functions, auth, analytics };
