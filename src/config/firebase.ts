// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUhVrNXjhz_gzdewf6qArNRY7syj7SiDQ",
  authDomain: "simple-language-phrasebook.firebaseapp.com",
  projectId: "simple-language-phrasebook",
  storageBucket: "simple-language-phrasebook.firebasestorage.app",
  messagingSenderId: "341258728002",
  appId: "1:341258728002:web:7cbfdb530d49785d3bf3db",
  measurementId: "G-3KK9JQF1TV",
  databaseURL: "https://simple-language-phrasebook.firebaseio.com",
};

console.log("Initializing Firebase...");
console.log("Current number of Firebase apps:", getApps().length);

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
console.log("Firebase app initialized:", app.name);

const db = getFirestore(app);
const auth = getAuth(app);
console.log("Firebase auth initialized");

export { db, auth };
