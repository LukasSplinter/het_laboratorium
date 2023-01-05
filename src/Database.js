//FIREBASE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, get, child } from "firebase/database";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyBUR_PjyPTYDv3x4LOmTs9Odd1hti6XqHg",
    authDomain: "het-laboratorium.firebaseapp.com",
    databaseURL: "https://het-laboratorium-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "het-laboratorium",
    storageBucket: "het-laboratorium.appspot.com",
    messagingSenderId: "483817721353",
    appId: "1:483817721353:web:990d7108f0d9838e2e32d8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getDatabase();
export const dbRef = ref(database);

/**
 * Get all rooms in an object from the database
 * @returns {Promise<unknown>}
 */
export const getRooms = () => {
    return new Promise((resolve, reject) => {
        get(child(dbRef, 'rooms')).then((snapshot) => {
            //check for correct response
            if (snapshot.exists()) {
                resolve(snapshot.val());
            } else {
                reject("incorrect query")
            }
        })
    })
}