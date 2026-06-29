import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginlearnmist.firebaseapp.com",
  projectId: "loginlearnmist",
  storageBucket: "loginlearnmist.firebasestorage.app",
  messagingSenderId: "498924684090",
  appId: "1:498924684090:web:5c23473ca26f3e08420603",
  measurementId: "G-XFGVXMGFBE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
