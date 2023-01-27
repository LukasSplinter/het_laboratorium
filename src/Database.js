import data from "./data/data.json";

//FIREBASE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase, ref, get, set, child, update, onValue, remove, push} from "firebase/database";
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
                resolve(false);
                // reject(false);
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
 * TODO: room template incorporation, move to abstract function?
 * updates a room, given roomnumber and data
 * @param roomcode
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateRoom = (roomcode, data) => {
    return new Promise((resolve, reject) => {
        let newData = {};
        newData['rooms/' + roomcode] = {
            introductionIndex: data.introductionIndex,
            name: data.name,
            school: data.school,
            score: data.score
        };

        update(dbRef, newData).then(() => {
            resolve(newData);
        }).catch((err) => {
            reject(err);
        })
    })
}


/**
 * takes data object and path to update database
 * @param path
 * @param data
 * @returns {Promise<unknown>}
 */
export const updateData = (path, data) => {
    return new Promise((resolve, reject) => {
        let newData = {};
        newData[path] = {...data};

        update(dbRef, newData).then(() => {
            resolve(newData);
        }).catch((err) => {
            reject(err);
        })
    })
}


/**
 * takes data object and adds it to given path in database
 * @param path
 * @param data
 * @returns {Promise<unknown>}
 */
export const setData = (path, data) => {
    return new Promise((resolve, reject) => {

        set(child(dbRef, path), data).then(() => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}


/**
 * works the same as setData(), but instead of pushing to absolute path, pushes to child with firebase KEY
 * @param path
 * @param data
 */
export const pushChild = (path, data) => {
    return new Promise((resolve, reject) => {

        let keyPath = push(child(dbRef, path));
        set(keyPath, data).then(()=> {
            resolve({key: keyPath.key, data: data});
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
                resolve({empty: true});
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
    return onValue(pathRef, snapshot => {
        if (snapshot.exists()) {
            func(snapshot.val());
        }
    })
}


/**
 * removes node at given path from database
 * @param path
 * @returns {Promise<unknown>}
 */
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

/**
 * Creates room with room template
 * @param className
 * @param schoolName
 * @returns {Promise<unknown>}
 */
export const createRoom = async (className, schoolName) => {
    let key = generateKey();

    //edgecase that the same key is generated twice
    while (true) {
        try {
            let roomExists = await checkIfRoomExists(key);

            if (roomExists !== true) {
                break;
            } else {
                key = generateKey();
            }
        } catch (err) {
            console.error(err);
        }
    }

    //post data to db
    return new Promise((resolve, reject) => {
        //use template from data
        let newRoom = {... data.room_template};
        newRoom.name = className;
        newRoom.school = schoolName;
        newRoom.date = new Date().toLocaleDateString();

        set(child(dbRef, "rooms/" + key), newRoom).then(() => {
            resolve(key);
        }).catch((err) => {
            reject(err);
        })
    })
}

/**
 * generating a pseudo-random key based on current time.
 * Google firebase generates random ids - but these are hashes, and not numerical - which is what we are looking for
 * @returns {number}
 */
const generateKey = () => {
    let date = new Date();
    let timestamp = date.getTime();

    //get last 3 ms of timestamp
    let dropFirst = timestamp.toString().slice(-3);
    //get random int of char length 2 (0 - 99)
    let randomInt = Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10000);

    let key = dropFirst * randomInt;
    key = key.toString().slice(0,5).padEnd(5, "0");

    return parseInt(key);
}