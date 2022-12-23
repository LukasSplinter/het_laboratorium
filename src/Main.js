import React from 'react';
import ReactDOM from 'react-dom';

//components
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Teacher } from './components/Teacher';
import { Student } from './components/Student';

const allowedScreens = ["home", "teacher", "student"];

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: 1234,
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
            <main>
                <Header roomcode="1234" navigationHook={screenNavigationHook}/>
                {this.state.window === "home" && < Home/>}
                {this.state.window === "teacher" && < Teacher/>}
                {this.state.window === "student" && < Student/>}

                {this.state.window === "fallback" && < Home/>}
            </main>
        );
    }
}
