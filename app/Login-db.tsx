import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbErzcAafflJucjPgkBy9AFi7sknLHpTY",
    authDomain: "summaryspot12.firebaseapp.com",
    databaseURL: "https://summaryspot12-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "summaryspot12",
    storageBucket: "summaryspot12.appspot.com",
    messagingSenderId: "104402233205",
    appId: "1:104402233205:web:49fd9f332f254ea397553c",
    measurementId: "G-C76HCJZ37B"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
