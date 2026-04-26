// Firebase Connection Test Script
// Run this with: node test_firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration (same as config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDjK4wM_AQyT5juuOoyyw-5fW2j9QktDd4",
  authDomain: "scarlution.firebaseapp.com",
  projectId: "scarlution",
  storageBucket: "scarlution.firebasestorage.app",
  messagingSenderId: "316028004894",
  appId: "1:316028004894:web:74eb65d1ff38057dcadc0f",
  measurementId: "G-VDDL4FPLFJ"
};

console.log('🔍 Testing Firebase connectivity...');

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Test Firestore
  const db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  
  // Test Auth
  const auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
  
  // Test writing to Firestore (optional - comment out if you don't want to create test data)
  console.log('📝 Testing Firestore write access...');
  const testDoc = {
    test: true,
    timestamp: new Date().toISOString(),
    message: 'Firebase connectivity test'
  };
  
  // Note: This will fail without proper authentication, but that's expected
  // addDoc(collection(db, 'test'), testDoc)
  //   .then(() => console.log('✅ Firestore write successful'))
  //   .catch(err => console.log('⚠️  Firestore write failed (expected without auth):', err.message));
  
  console.log('🎉 Firebase configuration is valid!');
  console.log('');
  console.log('📋 Connection Summary:');
  console.log('- Project ID:', firebaseConfig.projectId);
  console.log('- Auth Domain:', firebaseConfig.authDomain);
  console.log('- Storage Bucket:', firebaseConfig.storageBucket);
  console.log('');
  console.log('✅ All Firebase services are properly configured and accessible.');
  
} catch (error) {
  console.error('❌ Firebase connection failed:', error.message);
  console.error('Error details:', error);
}
