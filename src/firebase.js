// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrg4u46wQgpghgVDO0Mf4wgd9vx5nNjig",
  authDomain: "safevoyage-6d0ef.firebaseapp.com",
  projectId: "safevoyage-6d0ef",
  storageBucket: "safevoyage-6d0ef.firebasestorage.app",
  messagingSenderId: "343291946089",
  appId: "1:343291946089:web:d52236833d356d1fd36ef8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
