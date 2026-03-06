import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyB-xxxx",
  authDomain: "lapor-in-177c1.firebaseapp.com",
  projectId: "lapor-in-177c1",
  storageBucket: "lapor-in-177c1.firebasestorage.app",
  messagingSenderId: "865694055211",
  appId: "1:865694055211:web:defa9a4557178f8b60e36e"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy };
