import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBKxd-JIv-7C2fIxsVpjmCQWweBmYaSpD8",
  authDomain: "phishfinder-eae9e.firebaseapp.com",
  projectId: "phishfinder-eae9e",
  storageBucket: "phishfinder-eae9e.firebasestorage.app",
  messagingSenderId: "399908337199",
  appId: "1:399908337199:web:c03d3b2e84997b1dc5f8da"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
