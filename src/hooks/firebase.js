import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtRwWg16cK39a7jRGqTH5PWs7-J7e4jqg",
  authDomain: "locknotes-82ac6.firebaseapp.com",
  projectId: "locknotes-82ac6",
  storageBucket: "locknotes-82ac6.firebasestorage.app",
  messagingSenderId: "333790739546",
  appId: "1:333790739546:web:22ae0ab1b90ec2cb052c63",
  measurementId: "G-31FYG2BF1P",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
