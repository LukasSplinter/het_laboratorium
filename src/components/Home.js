import React from 'react';
import ReactDOM from 'react-dom';

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

                <div className="row">
                    <p className={"paragraph introduction col-12 col-lg-4"}>Het docentportaal voor de interactieve introductie voor het onderwijsprogramma 'stroom geeft energie'.</p>
                </div>
                <div className="row">
                    <div className="scrollDown col-2">
                        <img className={"scrollDown__icon"} src={iconScrolldown} alt="scroll down icon"/>
                    </div>
                </div>

                <RoomNav createRoomHook joinRoomHook/>

                <div className="row">
                    <p className={"paragraph introduction col-12 col-lg-4"}>Maak de kamer in op het apparaat waarmee de museumdocent werkt - en vol deze code in op de schermen in het lokaal.</p>
                </div>
            </section>
        );
    }
}
