// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0-goh9H3c-vDr_EfD3oX27XEp9QZliT4",
  authDomain: "tales-of-the-party-firebase.firebaseapp.com",
  projectId: "tales-of-the-party-firebase",
  storageBucket: "tales-of-the-party-firebase.firebasestorage.app",
  messagingSenderId: "711403128587",
  appId: "1:711403128587:web:eb09ed9811d62ae791040e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
