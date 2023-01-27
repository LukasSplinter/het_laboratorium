import React from 'react';
import textData from "../data/data.json";

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/screen.scss";
import "../styles/teacher.scss";

import { Title } from './Title';
import { ControlPanel } from './ControlPanel';

import {Tabs} from "./Tabs";
import {TextControl} from "./TextControl";


export class Teacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: this.props.roomcode
        };
    }

    render() {
        return (
            <section className="Teacher screen">
                <Title/>
                <Tabs tabTitles={["Uitleg", "Tekstbediening", "Puntenbediening"]}>
                    <article className={"explanation"}>
                        <h2 className="explanation__title">Uitleg het laboratorium van Volta</h2>
                        <p className="explanation__text">{textData.teacherscreen.explanation}</p>
                        <h2 className="explanation__title">Tekstbediening</h2>
                        <p className="explanation__text">{textData.teacherscreen.explain_textcontrols}</p>
                        <h2 className="explanation__title">Puntenbediening</h2>
                        <p className="explanation__text">{textData.teacherscreen.explain_pointcontrols}</p>
                    </article>
                    <TextControl roomcode={this.state.roomcode}/>
                    <ControlPanel roomcode={this.state.roomcode}/>
                </Tabs>

            </section>
        );
    }
}
