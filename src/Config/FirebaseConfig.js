import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_6MWnuDKNZ9QH3IvGwNeLBmHZ7PxL1s4",
  authDomain: "blog-website-a6d91.firebaseapp.com",
  projectId: "blog-website-a6d91",
  storageBucket: "blog-website-a6d91.firebasestorage.app",
  messagingSenderId: "625735727458",
  appId: "1:625735727458:web:b16a183f67efee87f2143b",
  measurementId: "G-FXL9HZWQB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db}