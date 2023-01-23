import React from 'react';
import textData from "../data/data.json"

// import "../styles/xx.scss";
import "../styles/TextControl.scss";
import iconArrow from "../assets/icon-arrow.svg"

import { LoadingIcon } from "./LoadingIcon";
import * as DATABASE from "../Database";

export class TextControl extends React.Component {
    constructor(props) {
        super(props);
        this.maxLessonIndex = 0,
        this.state = {
            progressionBarWidth: "0%",
            lessonIndex: 0,
            roomcode: this.props.roomcode,
            text: {}
        };
    }


    componentDidMount() {
        this.fetchText().then(()=>{
            this.fetchProgress();
        });
    }


    componentWillUnmount() {
    }

    async fetchText() {
        try {
            let totalTextLength = 0;
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
                let categorySize = 0;

                //gets text items...
                let categoryText = Object.values(parsedText[category])
                    //sorts to order...
                    .sort((a, b) => {
                        return a.order - b.order
                        //and returns text string
                    }).map((text) => {
                        totalTextLength++;
                        categorySize++;

                        return text.text;
                    });

                parsedText[category] = {
                    text: categoryText,
                    size: categorySize,
                    stepSize: 33 / categorySize
                };
            });

            this.maxLessonIndex = totalTextLength;
            this.setState({text: parsedText});

        } catch (err) {
            this.setState({text: {}});
            console.error(err)
        }
    }


    async fetchProgress () {
        try {
            let response = await DATABASE.getData("rooms/" + this.state.roomcode + "/lessonIndex");

            this.setState({lessonIndex: response});
            this.updateVisualProgress(response);
        } catch (err) {
            console.error(err)
        }
    }
    
    
    updateVisualProgress(textIndex) {
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
            let currentScore = await DATABASE.getData(path);
            let newIndex = Math.min(Math.max((currentScore + amount), 0), this.maxLessonIndex);

            //update current score
            let response = await DATABASE.setData(path, newIndex);

            this.updateVisualProgress(newIndex);

        } catch (err) {
            console.error(err);
        }
    }


    render() {

        return (
            <section className="textControl container">
                <div className="progression">
                    <div name={"welcome"} className="checkpoint">
                        <label htmlFor="welcome">Welkom</label>
                    </div>
                    <div name={"introduction"} className="checkpoint">
                        <label htmlFor="introduction">Begin introductie</label>
                    </div>
                    <div name={"lessonStart"} className="checkpoint">
                        <label htmlFor="lessonStart">Begin les</label>
                    </div>
                    <div name={"lessonEnd"} className="checkpoint">
                        <label htmlFor="lessonEnd">Einde les</label>
                    </div>
                    <div className="bar" style={{width: this.state.progressionBarWidth}}></div>
                </div>
                <div className="controlButtons">
                    <button className={"button button--decrease"}
                            onClick={()=>{this.updateLessonIndex(-1)}}
                            tite={textData.teacherscreen.buttons.increaseLessonIndex}>
                        <img src={iconArrow} alt="arrow icon" className="icon"/>
                    </button>
                    <button className={"button button--increase"}
                            onClick={()=>{this.updateLessonIndex(1)}}
                            tite={textData.teacherscreen.buttons.decreaseLessonIndex}>
                        <img src={iconArrow} alt="arrow icon" className="icon"/>
                    </button>
                </div>

            </section>
        );
    }
}
