import React from 'react';
import * as DATABASE from "../Database";

import { VoltaicPile } from "./VoltaicPile";
import { ProgressBar } from "./ProgressBar";
import { SpeechBubble } from "./SpeechBubble";

// import "../styles/xx.scss";
import "../styles/screen.scss";
import "../styles/Student.scss";

export class Student extends React.Component {
    constructor(props) {
        super(props);
        this.progressBar = React.createRef();
        this.state = {
            roomcode: this.props.roomcode,
            score: 0,
            duration: 0,
            startTimer: false
        };
    }

    componentDidMount(){
        this.unsubscribe = DATABASE.attachListener("rooms/" + this.state.roomcode + "/score",
            (score) => {this.updateScore(score)});

        this.fetchDuration();

        this.setState({startTimer: true});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    async fetchDuration() {
        try {
            let duration = await DATABASE.getData("settings/duration");
            this.setState({duration: duration});
        } catch (err) {
            console.error(err)
        }
    }


    updateScore(score) {
        this.setState({score: score});
    }


    render() {
        return (
            <section className="student screen">
                <ProgressBar duration={this.state.duration} start={this.state.startTimer}/>
                <div className="voltaContainer">
                    <div className="score">{this.state.score}</div>
                    <VoltaicPile score={this.state.score}/>
                </div>

                <SpeechBubble color={"ff0000"}>test</SpeechBubble>

                <section className="unlockable">
                </section>
            </section>
        );
    }
}
