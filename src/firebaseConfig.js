import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDudy32zhsZC2HNHfaq3NV7VaJJFK1f2Yo",
  authDomain: "devansh-wevois-assignment.firebaseapp.com",
  projectId: "devansh-wevois-assignment",
  storageBucket: "devansh-wevois-assignment.appspot.com",
  messagingSenderId: "971773046110",
  appId: "1:971773046110:web:895188f7f23a632251b3cf",
  measurementId: "G-0XFP7251M2",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
