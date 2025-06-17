 // Import Firebase modules
 import { initializeApp } from 'firebase/app';
 import { getDatabase } from 'firebase/database';

 // Your Firebase config
 const firebaseConfig = {
  authDomain: "biology-app-7dade.firebaseapp.com",
  databaseURL: "https://biology-app-7dade-default-rtdb.firebaseio.com", // <-- REQUIRED FOR RTDB
  projectId: "biology-app-7dade",
  storageBucket: "biology-app-7dade.appspot.com",
  messagingSenderId: "974237116430",
  appId: "1:974237116430:web:23d737db2764e004d8345f",
  measurementId: "G-650CEK50SN"
 };

 // Initialize Firebase

 // Auth and Realtime Database
 const app = initializeApp(firebaseConfig);
 export const database = getDatabase(app);
 