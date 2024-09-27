
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDzdOryEzjKOSYu5q-EiTZyK5DcwwsUqms",
  authDomain: "koifarmshop-1f095.firebaseapp.com",
  projectId: "koifarmshop-1f095",
  storageBucket: "koifarmshop-1f095.appspot.com",
  messagingSenderId: "73945260552",
  appId: "1:73945260552:web:164c3f6496f53250b327bd",
  measurementId: "G-SNF9TGJ1Z6",
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);