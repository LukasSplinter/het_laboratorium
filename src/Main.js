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
import { getDatabase } from "firebase/database";
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

    render() {
        const screenNavigationHook = navigateTo => {
            if (allowedScreens.includes(navigateTo)) {
                this.setState({window: navigateTo});
            }
            else {
                this.setState({window: "fallback"})
            }
        }

        return (
            <main className="main">
                <Header roomcode={this.state.roomcode} navigationHook={screenNavigationHook}/>
                {this.state.window === "home" && < Home db={database} roomcode={this.state.roomcode}/>}
                {this.state.window === "teacher" && < Teacher db={database} roomcode={this.state.roomcode}/>}
                {this.state.window === "student" && < Student db={database} roomcode={this.state.roomcode}/>}

                {this.state.window === "fallback" && < Home/>}
            </main>
        );
    }
}
