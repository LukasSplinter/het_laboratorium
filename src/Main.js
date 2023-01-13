import React from 'react';
import ReactDOM from 'react-dom';
import * as DATABASE from "./Database";

//components
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Teacher } from './components/Teacher';
import { Student } from './components/Student';
import { Admin } from './components/Admin';

const allowedScreens = ["home", "teacher", "student", "admin"];


export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: "18423",
            window: "student",
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
    async switchRoomHook (roomcode, queryElement) {
        //empty roomcode guard
        if (roomcode === "") return;

        let roomExists = false;

        try {
            roomExists = await DATABASE.checkIfRoomExists(roomcode);
            this.setState({roomcode: roomcode});
            //user feedback
            queryElement.classList.add("success");
        } catch (err) {
            //user feedback
            queryElement.value = "geen kamer";
            queryElement.classList.add("failure");
        }

        //timeout with feedback clear
        setTimeout(()=>{
            queryElement.classList.remove("success", "failure");
            queryElement.value = "";
        }, 1000);
    }

    render() {
        return (
            <main className="main container">
                <Header key={this.state.roomcode} roomcode={this.state.roomcode}
                        navigationHook={this.screenNavigationHook.bind(this)}
                        switchRoomHook={this.switchRoomHook.bind(this)}
                        activeWindow={this.state.window}/>

                {this.state.window === "home" && <Home roomcode={this.state.roomcode}
                                                       switchRoomHook={this.switchRoomHook.bind(this)}/>}
                {this.state.window === "teacher" && <Teacher roomcode={this.state.roomcode}/>}
                {this.state.window === "student" && <Student roomcode={this.state.roomcode}/>}
                {this.state.window === "admin" && <Admin />}

                {this.state.window === "fallback" && < Home/>}
            </main>
        );
    }
}
