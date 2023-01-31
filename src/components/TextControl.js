import React from 'react';
import textData from "../data/data.json"

// import "../styles/xx.scss";
import "../styles/TextControl.scss";
import iconArrow from "../assets/icon-arrow.svg"

import {getData, setData} from "../Database";

export class TextControl extends React.Component {
    constructor(props) {
        super(props);
        this.maxLessonIndex = 0,
        this.state = {
            progressionBarWidth: "0%",
            lessonIndex: 0,
            roomcode: this.props.roomcode,
            text: {},
            allText: [],
            user_logged_in: this.props.user_logged_in
        };
    }


    componentDidMount() {
        this.fetchText().then(()=>{
            this.fetchProgress();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props) return;

        this.setState({
            roomcode: this.props.roomcode,
            user_logged_in: this.props.user_logged_in
        })
    }

    async fetchText() {
        try {
            let allText = [];
            let totalTextLength = 0;
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
                let categorySize = 0;

                //gets text items...
                let categoryText = Object.values(parsedText[category])
                    //sorts to order...
                    .sort((a, b) => {
                        return a.order - b.order
                        //and returns text string
                    }).map((text) => {
                        if (!text.hasOwnProperty("text")) return;

                        totalTextLength++;
                        categorySize++;

                        allText.push(text.text)
                        return text.text;
                    });

                parsedText[category] = {
                    text: categoryText,
                    size: categorySize,
                    stepSize: 33 / categorySize
                };
            });

            this.maxLessonIndex = totalTextLength;
            this.setState({
                text: parsedText,
                allText: allText
            });

        } catch (err) {
            this.setState({text: {}});
            console.error(err)
        }
    }


    async fetchProgress () {
        try {
            let response = await getData("rooms/" + this.state.roomcode + "/lessonIndex");

            this.setState({lessonIndex: response});
            this.updateVisualProgress(response);
        } catch (err) {
            console.error(err)
        }
    }


    updateVisualProgress(textIndex) {
        textIndex++;
        //value used for tracking css width - later used in rendering
        let newProgressWidth = 0;

        let categories = Object.keys(this.state.text);
        for (let i = 0; i < categories.length; i++) {
            let category = this.state.text[categories[i]];

            if (textIndex >= category.size) {
                //completed category text, set textIndex to difference and continue loop
                textIndex -= category.size;
                newProgressWidth += 33.3;
            } else {
                //falsey if index is in current category, calculate correct progression and break out of loop
                newProgressWidth += textIndex * category.stepSize;
                break;
            }
        }
        
        //set width attribute as state, used in render
        this.setState({progressionBarWidth: newProgressWidth + "%"});
    }


    async updateLessonIndex(amount) {
        let path = "rooms/" + this.state.roomcode + "/lessonIndex";
        try {
            //get and modify current score
            let currentScore = await getData(path);
            let newIndex = Math.min(Math.max((currentScore + amount), 0), this.maxLessonIndex - 1);

            //update current score
            let response = await setData(path, newIndex);

            this.updateVisualProgress(newIndex);

            this.setState({lessonIndex: newIndex})

        } catch (err) {
            console.error(err);
        }
    }


    render() {
        return (
            <section className="textControl container">
                <div className="textpreview">
                    <span className={"textpreview__next " +
                        ((this.state.lessonIndex >= this.maxLessonIndex - 1) ? "final" : "")}>
                        <span className="label">{textData.teacherscreen.labels.next_text}</span>
                        {(this.state.lessonIndex < this.maxLessonIndex - 1)
                            ? this.state.allText[this.state.lessonIndex + 1]
                            : textData.teacherscreen.labels.text_empty
                        }
                    </span>
                    <p className="textpreview__current">
                        <span className="label">{textData.teacherscreen.labels.current_text}</span>
                        "{this.state.allText[this.state.lessonIndex]}"
                    </p>
                </div>
                <div className="progression">
                    <div name={"welcome"} className="checkpoint">
                        <label htmlFor="welcome">1</label>
                    </div>
                    <div name={"introduction"} className="checkpoint">
                        <label htmlFor="introduction">2</label>
                    </div>
                    <div name={"lessonStart"} className="checkpoint">
                        <label htmlFor="lessonStart">3</label>
                    </div>
                    <div name={"lessonEnd"} className="checkpoint">
                        <label htmlFor="lessonEnd">4</label>
                    </div>
                    <div className="bar" style={{width: this.state.progressionBarWidth}}></div>
                </div>
                <div className="controlButtons">
                    <button name={"vorige tekst"}
                            className={"button button--decrease"}
                            disabled={!this.state.user_logged_in}
                            onClick={()=>{this.updateLessonIndex(-1)}}
                            tite={textData.teacherscreen.buttons.increaseLessonIndex}>
                        <img src={iconArrow} alt="arrow icon" className="icon"/>
                    </button>
                    <button name={"volgende tekst"}
                            className={"button button--increase"}
                            disabled={!this.state.user_logged_in}
                            onClick={()=>{this.updateLessonIndex(1)}}
                            tite={textData.teacherscreen.buttons.decreaseLessonIndex}>
                        <img src={iconArrow} alt="arrow icon" className="icon"/>
                    </button>
                </div>
                <ol className="checkpointList">
                    <li>1: Welkom</li>
                    <li>2: Begin introductie</li>
                    <li>3: Begin les</li>
                    <li>4: Einde les</li>
                </ol>
            </section>
        );
    }
}
