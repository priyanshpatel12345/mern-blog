// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-mern-ff8fc.firebaseapp.com",
  projectId: "blog-mern-ff8fc",
  storageBucket: "blog-mern-ff8fc.appspot.com",
  messagingSenderId: "1069728976548",
  appId: "1:1069728976548:web:98cc7fafa5e03f1ce62031",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
