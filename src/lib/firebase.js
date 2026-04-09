import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBy1WG96BsQgJFd_ZtJiEf1h4Z9N9DlGqI",
  authDomain: "project-1327142892963748425.firebaseapp.com",
  projectId: "project-1327142892963748425",
  storageBucket: "project-1327142892963748425.firebasestorage.app",
  messagingSenderId: "592248513955",
  appId: "1:592248513955:web:ad4779ba02c569c6d9a616"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const storage = getStorage(app)

export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider();
