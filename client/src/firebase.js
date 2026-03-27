// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // You will likely need this for authentication
import { getDatabase } from "firebase/database"; // Realtime Database

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQctrkTw6x4AaFfQ11y94FcR4npvnUdT8",
  authDomain: "studyhub-5d7a4.firebaseapp.com",
  databaseURL: "https://studyhub-5d7a4-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "studyhub-5d7a4",
  storageBucket: "studyhub-5d7a4.firebasestorage.app",
  messagingSenderId: "410375000883",
  appId: "1:410375000883:web:d62e53b4ba293ec8e82446",
  measurementId: "G-H3MZ95LNRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialized auth
const database = getDatabase(app); // Initialized realtime database

export { app, analytics, auth, database };
