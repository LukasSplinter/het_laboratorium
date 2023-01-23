import React from 'react';
import textData from "../data/data.json";

// import "../styles/xx.scss";
import "../styles/controlPanel.scss";


import { PuzzleControl } from "./PuzzleControl";
import { LoadingIcon } from "./LoadingIcon";
import * as DATABASE from "../Database";

export class ControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: this.props.roomcode,
            puzzles: null,
            score: 0
        };
    }


    componentDidMount() {
        this.fetchScore();
        this.fetchPuzzles();
        this.fetchDuration();

        this.unsubscribe = DATABASE.attachListener("rooms/" + this.state.roomcode + "/score",
            (score)=>{this.setState({score: score})});
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

    async fetchScore() {
        try {
            let response = await DATABASE.getData("rooms/" + this.state.roomcode + "/score");
            this.setState({score: response});
        } catch (err) {
            console.error(err)
        }
    }

    async fetchPuzzles() {
        try {
            let response = await DATABASE.getData("puzzles");

            //create array with puzzle data as elements
            let puzzleData = Object.values(response);
            let puzzleArray = puzzleData.map((item, index) => {
                return <PuzzleControl
                    key={index}
                    counter={index + 1}
                    name={item.name}
                    data={item}
                    awardPointsHook={()=>{this.changeScore(parseInt(this.state.score) + parseInt(item.worth))}}/>
            })
            //set array as state
            this.setState({puzzles: puzzleArray});
        } catch (err) {
            this.setState({puzzles: []});
            window.alert("Geen puzzles in de database gevonden, controleer het adminpaneel");
            console.error(err)
        }
    }

    //function to manually change the score, used to increment or decrement the score of the room
    async changeScore (score) {
        //guard statement for negative scores
        if (score < 0) return;

        try {
            let response = await DATABASE.changeScore(this.state.roomcode, score);

            this.setState({score});

        } catch(err) {
            console.error(err);
        }
    }


    render() {

        return (
            <section className="controlPanel container">
                <div className="pointControl row">
                    <div className="score col-12 col-md-6">
                        <span className="score__label">punten</span>

                        <span className="score__value">{this.state.score}</span>
                    </div>

                    <div className="col-12 col-md-6">
                        <button className="pointButton pointButton--decrease"
                                onClick={()=>{this.changeScore(this.state.score - 1)}}
                                title={textData.teacherscreen.buttons.decreaseScore}> </button>
                        <button className="pointButton pointButton--increase"
                                onClick={()=>{this.changeScore(this.state.score + 1)}}
                                title={textData.teacherscreen.buttons.increaseScore}> </button>
                    </div>

                </div>

                {this.state.puzzles !== null
                ? this.state.puzzles
                : <LoadingIcon size={"large"}/>
                }
            </section>
        );
    }
}
