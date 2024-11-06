// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIEcXDNI4KwZSsFFknU-lMgsnSQA-Cdag",
  authDomain: "capacity-standard.firebaseapp.com",
  projectId: "capacity-standard",
  storageBucket: "capacity-standard.appspot.com",
  messagingSenderId: "873764580681",
  appId: "1:873764580681:web:3c67455cb25d009db47e98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export {db, auth}