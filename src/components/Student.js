import React from 'react';
import * as DATABASE from "../Database";

import { VoltaicPile } from "./VoltaicPile";
import { ProgressBar } from "./ProgressBar";
import { SpeechBubble } from "./SpeechBubble";

// import "../styles/xx.scss";
import "../styles/screen.scss";
import "../styles/Student.scss";
import {VoltaPortrait} from "./VoltaPortrait";

export class Student extends React.Component {
    constructor(props) {
        super(props);
        this.progressBar = React.createRef();
        this.state = {
            text: {},
            roomcode: this.props.roomcode,
            score: 0,
            duration: 0,
            startTimer: false
        };
    }

    componentDidMount(){
        this.unsubscribeScore = DATABASE.attachListener("rooms/" + this.state.roomcode + "/score",
            (score) => {this.updateScore(score)});
        // this.unsubscribeIntroduction

        this.fetchText();

        this.fetchDuration();
        this.setState({startTimer: true});
    }

    componentWillUnmount() {
        this.unsubscribeScore();
    }


    async fetchDuration() {
        try {
            let duration = await DATABASE.getData("settings/duration");
            this.setState({duration: duration});
        } catch (err) {
            console.error(err)
        }
    }


    async fetchText() {
        try {
            let introductionText = await DATABASE.getData("text/introduction");
            let startLessonText = await DATABASE.getData("text/startLesson");
            let endLessonText = await DATABASE.getData("text/endLesson");

            let parsedText = {
                introductionText: introductionText,
                startLessonText: startLessonText,
                endLessonText: endLessonText
            }

            //iterates through text categories...
            Object.keys(parsedText).forEach((category, index) => {

                //gets text items...
                let categoryText = Object.values(parsedText[category])
                    //sorts to order...
                    .sort((a, b) => {
                        return a.order - b.order
                    //and returns text string
                    }).map((text) => {
                        return text.text;
                    });

                parsedText[category] = categoryText;
            });

            this.setState({text: parsedText});
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



                <VoltaPortrait dialogue={"oh wow, jullie hebben nu al " + this.state.score + " punten!"} />

                <section className="unlockable">
                </section>
            </section>
        );
    }
}
