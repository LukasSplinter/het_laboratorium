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
        };
    }

    render() {
        return (
            <section className="home screen">
                <Title />

                <div className="introduction row">
                    <p className={"paragraph col-12 col-lg-4"}>Het docentportaal voor de interactieve introductie voor het onderwijsprogramma 'stroom geeft energie'.</p>
                    <div className="col-12 col-lg-4 introduction__cta">
                        <RoomNav joinRoomHook={this.props.switchRoomHook.bind(this)}/>
                    </div>
                </div>

                <div className="row">
                    <p className={"paragraph introduction col-12 col-lg-4"}>{textData.homescreen.room_explanation}</p>
                </div>
            </section>
        );
    }
}
