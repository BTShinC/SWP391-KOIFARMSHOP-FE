import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC1FR1taMA2LB903p9pwrgKCuTxRa00unc",
  authDomain: "fir-221c7.firebaseapp.com",
  databaseURL: "https://fir-221c7-default-rtdb.firebaseio.com",
  projectId: "fir-221c7",
  storageBucket: "fir-221c7.appspot.com",
  messagingSenderId: "349816085765",
  appId: "1:349816085765:web:9eaa29856e4fc38507eb6c",
  measurementId: "G-HVKNT20XLN",
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
