import React from 'react';
import textData from "../data/data.json";

import { VoltaicPile } from "./VoltaicPile";
import { ProgressBar } from "./ProgressBar";
import {VoltaPortrait} from "./VoltaPortrait";

// import "../styles/xx.scss";
import "../styles/screen.scss";
import "../styles/Student.scss";

import itemShelf from "../assets/art_shelf.svg";
import itemLamp from "../assets/art_lamp.svg";
import itemPlasma from "../assets/art_plasmaball.svg";
import itemPile from "../assets/art_voltaic.svg";
import itemStratingh from "../assets/art_stratingh.svg";
import itemDoor from "../assets/art_door.svg";
import itemPlasmaArc from "../assets/plasmaball_arc.svg";
import {attachListener, getData} from "../Database";

export class Student extends React.Component {
    constructor(props) {
        super(props);
        this.progressBar = React.createRef();
        this.state = {
            dialogueFocussed: true,
            dialogue: "",
            text: {},
            roomcode: this.props.roomcode,
            score: 0,
            duration: 0,
            startTimer: false
        };
    }

    componentDidMount(){
        this.fetchText().then((response) => {
            this.unsubscribeProgress = attachListener("rooms/" + this.state.roomcode + "/lessonIndex",
                (lessonIndex) => {this.updateText(lessonIndex)});
        });

        this.fetchDuration();

        this.unsubscribeScore = attachListener("rooms/" + this.state.roomcode + "/score",
            (score) => {this.updateScore(score)});
    }

    componentWillUnmount() {
        this.unsubscribeScore();
        this.unsubscribeProgress();
    }


    updateText(lessonIndex) {
        let categories = {...this.state.text};
        let allText = [];
        Object.keys(categories).forEach((category) => {
            let categoryText = categories[category];

            for (let i = 0; i < categoryText.length; i++) {
                if (categoryText[i] !== undefined) {
                    allText.push(categoryText[i]);
                } else {
                    allText.push("");
                }
            }
        });
        this.setState({dialogue: allText[lessonIndex]})

        //when lesson is ending
        if (lessonIndex >= (this.state.text["introductionText"].length + 1)) {
            this.setState({
                ending: true
            });
        }
        //when introduction assignments are starting / introduction begin
        else if (lessonIndex >= this.state.text["introductionText"].length - 1) {
            this.setState({
                dialogueFocussed: false,
                startTimer: true,
            });
        }
    }


    async fetchDuration() {
        try {
            let duration = await getData("settings/duration");
            this.setState({duration: duration.value});
        } catch (err) {
            console.error(err)
        }
    }


    async fetchText() {
        try {
            let introductionText = await getData("text/introduction");
            let startLessonText = await getData("text/startLesson");
            let endLessonText = await getData("text/endLesson");

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
            this.setState({text: {}});
            console.error(err)
        }
    }


    updateScore(score) {
        this.setState({score: score});


    }


    getLastLayerHook(layer) {
        this.setState({dialogue: textData.studentscreen.volta_lines[layer]});
    }


    render() {
        let endingPlasmaShadows = "";
        for (let i = 1; i < Math.min(this.state.score, 20); i += 5) {
            endingPlasmaShadows += ("drop-shadow(5px 5px " + i + "px #2CEDE2bb) ")
        }
        let scoreSplit = this.state.score.toString().padStart(3, "0").split("");

        return (
            <section className={"student screen " +
                (this.state.ending ? "ending " : "")}>
                <ProgressBar duration={this.state.duration} start={this.state.startTimer}/>
                <div className="voltaContainer">
                    <div className="scoreCounter">
                        <span>{scoreSplit[0]}</span>
                        <span>{scoreSplit[1]}</span>
                        <span>{scoreSplit[2]}</span>
                    </div>
                    <VoltaicPile score={this.state.score} getLastLayerHook={this.getLastLayerHook.bind(this)}/>
                </div>



                <VoltaPortrait focussed={this.state.dialogueFocussed} dialogue={this.state.dialogue} />

                <section className="unlockable">
                    <article className="unlockable__item unlockable__item--door">
                        <img className={"item " + (this.state.score > 0 || this.state.ending ? "unlocked " : "")} src={itemDoor} alt="een getekende oude deur"/>
                    </article>
                    <article className="unlockable__item unlockable__item--voltaic">
                        <img className={"shelf " + (this.state.score > 3 || this.state.ending ? "unlocked " : "")} src={itemShelf} alt="een getekende plank" />
                        <img className={"item " + (this.state.score > 6 || this.state.ending ? "unlocked " : "")} src={itemPile} alt="een getekende zuil van volta"/>
                    </article>
                    <article className="unlockable__item unlockable__item--stratingh">
                        <img className={"shelf " + (this.state.score > 21 || this.state.ending ? "unlocked " : "")} src={itemShelf} alt="een getekende plank" />
                        <img className={"item " + (this.state.score > 23 || this.state.ending ? "unlocked " : "")} src={itemStratingh} alt="een getekent wagentje van stratingh"/>
                    </article>
                    <article className="unlockable__item unlockable__item--lamp">
                        <img className={"shelf " + (this.state.score > 30 || this.state.ending ? "unlocked " : "")} src={itemShelf} alt="een getekende plank" />
                        <img className={"item " + (this.state.score > 33 || this.state.ending ? "unlocked " : "")} src={itemLamp} alt="een getekende oude lamp"/>
                    </article>
                    <article className="unlockable__item unlockable__item--plasma">
                        <img className={"shelf " + (this.state.score > 9 || this.state.ending ? "unlocked " : "")} src={itemShelf} alt="een getekende plank" />
                        <img className={"item " + (this.state.score > 12 || this.state.ending ? "unlocked " : "")} src={itemPlasma} alt="een getekende plasmabol"/>
                    </article>
                </section>

                <section className="endingPlasma">
                    <img className={"img"} src={itemPlasma} alt="plasmabol"/>
                    <div className="arc" style={{filter: endingPlasmaShadows}}>
                        <img className={"img"} src={itemPlasmaArc} alt="plasmabol stroom"/>
                    </div>
                </section>
            </section>
        );
    }
}
