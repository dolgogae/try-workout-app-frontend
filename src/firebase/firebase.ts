// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXI_AB6MVD_1WqKCUq98JE-eErESEstVc",
  authDomain: "pt-finder-6eada.firebaseapp.com",
  projectId: "pt-finder-6eada",
  storageBucket: "pt-finder-6eada.appspot.com",
  messagingSenderId: "204891001366",
  appId: "1:204891001366:web:c6d979cbab3a821b231b37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth (app);