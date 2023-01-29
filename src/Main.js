import React from 'react';
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
            user_logged_in: false,
            user_data: {},
            roomcode: "",
            window: "home",
        };
    }


    /**
     * Hook for user login succes
     * Sets state values to user data
     * @param data
     */
    userLoggedInHook(data) {
        this.setState({
            user_logged_in: true,
            user_data: data
        });
    }

    /**
     * Hook for user logout succes
     * clears state values
     */
    userLoggedOutHook() {
        this.setState({
            user_logged_in: false,
            user_data: {}
        })
    }

    /**
     * Hook for screen navigation
     * checks if room is in allowedscreen array, navigates to it if called
     * @param navigateTo
     */
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
            if (roomExists) {
                this.setState({roomcode: roomcode});
                //user feedback
                queryElement.classList.add("success");
            } else {
                throw "NoSuchRoom";
            }

        } catch (err) {
            //user feedback
            queryElement.value = "geen sessie";
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
                        loginHook={this.userLoggedInHook.bind(this)}
                        logoutHook={this.userLoggedOutHook.bind(this)}
                        activeWindow={this.state.window}
                        user_logged_in={this.state.user_logged_in}/>

                {this.state.window === "home" && <Home roomcode={this.state.roomcode}
                                                       user_logged_in={this.state.user_logged_in}
                                                       switchRoomHook={this.switchRoomHook.bind(this)}/>}
                {this.state.window === "teacher" && <Teacher roomcode={this.state.roomcode} user_logged_in={this.state.user_logged_in}/>}
                {this.state.window === "student" && <Student roomcode={this.state.roomcode}/>}
                {this.state.window === "admin" && <Admin user_logged_in={this.state.user_logged_in}/>}

                {this.state.window === "fallback" && < Home/>}
            </main>
        );
    }
}
