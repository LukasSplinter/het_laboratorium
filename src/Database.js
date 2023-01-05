//FIREBASE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase, ref, get, child, update, onValue, remove} from "firebase/database";
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
                reject("no rooms exist or incorrect query!")
            }
        })
    })
}


/**
 * return true if room exists in database
 * @param roomCode
 * @returns {Promise<unknown>}
 */
export const checkIfRoomExists = (roomCode) => {
    return new Promise((resolve, reject) => {
        get(child(dbRef, 'rooms/' + roomCode)).then((snapshot) => {
            //return falsey if not found in DB
            if (snapshot.exists()) {
                resolve(true);
            } else {
                reject("Room does not exist!");
            }
        })
    })
}


/**
 * changes score of specific room, returns score as resolve
 * @param roomcode
 * @param score
 * @returns {Promise<unknown>}
 */
export const changeScore = (roomcode, score) => {
    return new Promise((resolve, reject) => {
        let newData = {};
        newData['rooms/' + roomcode + '/score'] = score;

        update(dbRef, newData).then(() => {
            resolve(score);
        }).catch((err) => {
            reject(err);
        })

    })
}


/**
 * gets data from specified path and returns it with resolve
 * @param path
 * @returns {Promise<unknown>}
 */
export const getData = (path) => {
    return new Promise((resolve, reject) => {
        get(child(dbRef, path)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(snapshot.val());
            } else {
                reject("data not found")
            }
        })
    })
}


/**
 * attaches a listener to specified path in database, running function upon change of value
 * @param path
 * @param func
 */
export const attachListener = (path, func) => {
    let pathRef = ref(database, path);
    onValue(pathRef, snapshot => {
        if (snapshot.exists()) {
            func(snapshot.val());
        }
    })
}


export const removeNode = (path) => {
    return new Promise((resolve, reject) => {
        let pathRef = ref(database, path);
        remove(pathRef).then(()=>{
            resolve(true);
        }).catch(err => {
            reject("Node can't be deleted");
        });
    })

}