import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAh-ftn6ggpTtZ_0qrVYDXaX5vqT_Pgm_E",
    authDomain: "amomed-acd60.firebaseapp.com",
    projectId: "amomed-acd60",
    storageBucket: "amomed-acd60.appspot.com",
    messagingSenderId: "322175485460",
    appId: "1:322175485460:web:05e9395b6ca7da553c4901",
    measurementId: "G-D5XEWDBFZS"
  };
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);