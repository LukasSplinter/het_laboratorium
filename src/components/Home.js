import React from 'react';
import textData from "../data/data.json";

// import "../styles/xx.scss";
import "../styles/screen.scss";
import iconScrolldown from '../assets/icon-arrow-circle.svg';

import { Title } from "./Title";
import { RoomNav } from "./RoomNav";

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_logged_in: this.props.user_logged_in
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props) return;

        this.setState({
            user_logged_in: this.props.user_logged_in
        })
    }

    render() {
        return (
            <section className="home screen">
                <Title />

                <div className="introduction row">
                    <p className={"paragraph col-12 col-lg-4"}>{textData.homescreen.intro}</p>
                    <div className="col-12 col-lg-4 offset-lg-1 introduction__cta">
                        <RoomNav user_logged_in={this.state.user_logged_in} joinRoomHook={this.props.switchRoomHook.bind(this)}/>
                    </div>
                </div>

                <div className="row">
                    <p className={"paragraph introduction col-12 col-lg-4"}>{textData.homescreen.room_explanation}</p>
                </div>
            </section>
        );
    }
}
