// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "quickbite-f4d9a.firebaseapp.com",
  projectId: "quickbite-f4d9a",
  storageBucket: "quickbite-f4d9a.firebasestorage.app",
  messagingSenderId: "572874748696",
  appId: "1:572874748696:web:b05f527b11fd7bd63ba46d"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}