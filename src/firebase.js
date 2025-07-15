// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUiu6_RfsDhLjGjalqmQ8BQxYxPPyVziA",
  authDomain: "gpal-7afcd.firebaseapp.com",
  projectId: "gpal-7afcd",
  storageBucket: "gpal-7afcd.appspot.com", // ✅ Fixed .app -> .app**spot**.com
  messagingSenderId: "504926840738",
  appId: "1:504926840738:web:1b99963cea3f1de2ce34fb",
  measurementId: "G-FDS2CLQDM5",
};

// ✅ Initialize Firebase once
const app = initializeApp(firebaseConfig);

// ✅ Export Auth & Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
