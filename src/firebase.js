// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyApSTOpNAWYrpFQdj8I86t_nmrwtIHnyuU",
    authDomain: "scum-price-gun.firebaseapp.com",
    projectId: "scum-price-gun",
    storageBucket: "scum-price-gun.appspot.com",
    messagingSenderId: "73157270074",
    appId: "1:73157270074:web:5ba2dde1a94875cdb1b303",
    measurementId: "G-R6Y9XBBP7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app)
export { db } 