// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCtYbCWRPWBSWYF-IfuOpc996t_7hEee4",
    authDomain: "minute-math-b2084.firebaseapp.com",
    projectId: "minute-math-b2084",
    storageBucket: "minute-math-b2084.firebasestorage.app",
    messagingSenderId: "793511013820",
    appId: "1:793511013820:web:f708588c23582b8cf8cfb9",
    measurementId: "G-KHBF9LJQPV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 