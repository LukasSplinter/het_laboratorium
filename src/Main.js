import React from 'react';
import ReactDOM from 'react-dom';

//components
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Teacher } from './components/Teacher';
import { Student } from './components/Student';

const allowedScreens = ["home", "teacher", "student"];

//FIREBASE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, get, child } from "firebase/database";
import {query} from "svg-url-loader";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUR_PjyPTYDv3x4LOmTs9Odd1hti6XqHg",
  authDomain: "het-laboratorium.firebaseapp.com",
  databaseURL: "https://het-laboratorium-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "het-laboratorium",
  storageBucket: "het-laboratorium.appspot.com",
  messagingSenderId: "483817721353",
  appId: "1:483817721353:web:990d7108f0d9838e2e32d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const database = getDatabase();


export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: "00000",
            window: "home",
        };
    }

    screenNavigationHook (navigateTo) {
        if (allowedScreens.includes(navigateTo)) {
            this.setState({window: navigateTo});
        }
        else {
            this.setState({window: "fallback"})
        }
    }

    /**
     * switches room code if it exists
     * @param roomcode
     * @param queryElement - element which search was conducted from, used for feedback
     */
    switchRoomHook (roomcode, queryElement) {
        //empty roomcode guard
        if (roomcode === "") return;

        let dbRef = ref(database);

        //get room code from db
        get(child(dbRef, 'rooms/' + roomcode)).then((snapshot) => {
            //returns false if the roomcode doesn't exist
            if (snapshot.exists()) {
                this.setState({roomcode: roomcode});

                //user feedback
                queryElement.classList.add("success");
            } else {
                //user feedback
                queryElement.classList.add("failure");
            }

            //timeout with feedback clear
            setTimeout(()=>{
                queryElement.classList.remove("success", "failure");
                queryElement.value = "";
            }, 1000)
        }).catch((err) => {
            console.error("error in switching room code GET request")
            console.error(err);
        });
    }

    render() {
        return (
            <main className="main container">
                <Header key={this.state.roomcode} roomcode={this.state.roomcode}
                        navigationHook={this.screenNavigationHook.bind(this)}
                        switchRoomHook={this.switchRoomHook.bind(this)}
                        activeWindow={this.state.window} db={database}/>

                {this.state.window === "home" && < Home db={database} roomcode={this.state.roomcode}/>}
                {this.state.window === "teacher" && < Teacher db={database} roomcode={this.state.roomcode}/>}
                {this.state.window === "student" && < Student db={database} roomcode={this.state.roomcode}/>}

                {this.state.window === "fallback" && < Home/>}
            </main>
        );
    }
}
