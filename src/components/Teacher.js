import React from 'react';

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/screen.scss";
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
                <Tabs tabTitles={["Tekstbediening", "Puntenbediening"]}>
                    <TextControl roomcode={this.state.roomcode}/>
                    <ControlPanel roomcode={this.state.roomcode}/>
                </Tabs>

            </section>
        );
    }
}
