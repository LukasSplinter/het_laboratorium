import React from 'react';
import ReactDOM from 'react-dom';

import { ref, child, get, update} from "firebase/database";

// import "../styles/xx.scss";
import "../styles/controlPanel.scss";


import { PuzzleControl } from "./PuzzleControl";
import { LoadingIcon } from "./LoadingIcon";

export class ControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            db: this.props.db,
            roomcode: this.props.roomcode,
            puzzles: null,
            score: 0
        };
    }


    componentDidMount() {
        this.fetchPuzzles(this.state.roomcode, this.state.db);

        let dbRef = ref(this.state.db);
        get(child(dbRef, "rooms/" + this.state.roomcode + "/score")).then((snapshot) => {
            let currentPoints = snapshot.val();

            this.setState({score: currentPoints});
        }).catch((err) => {
            console.error(err);
        })
    }

    //gets puzzles from database
    fetchPuzzles(roomcode, db) {
        let dbRef = ref(db);
        get(child(dbRef, "puzzles")).then((snapshot) => {
            //if data exists
            if (snapshot.exists()) {
                //create array with puzzle data as elements
                let puzzleData = Object.values(snapshot.val());
                let puzzleArray = puzzleData.map((item, index) => {
                    return <PuzzleControl
                    key={index}
                    counter={index + 1}
                    name={item.name}
                    data={item}
                    awardPointsHook={this.rewardPuzzlePoints.bind(this)}/>
                })
                //set array as state
                this.setState({puzzles: puzzleArray})
            } else {
                //no puzzles in the database
                window.alert("Geen puzzles in de database gevonden, controleer het adminpaneel");
            }
        }).catch((err) => {
            console.error(err);
        })
    }


    rewardPuzzlePoints (pointsToAdd) {
        let dbRef = ref(this.state.db);
        get(child(dbRef, "rooms/" + this.state.roomcode + "/score")).then((snapshot) => {
            let currentPoints = snapshot.val();

            let newPoints = currentPoints + pointsToAdd;
            let newData = {};
            newData['rooms/' + this.state.roomcode + '/score'] = newPoints;

            update(ref(this.state.db), newData);

            this.setState({score: newPoints});

        }).catch((err) => {
            console.error(err);
        })
    }


    //function to manually change the score, used to increment or decrement the score of the room
    changeScore (score) {
        //guard statement for negative scores
        if (score < 0) return;

        let dbRef = ref(this.state.db);

        let newData = {};
        newData['rooms/' + this.state.roomcode + '/score'] = score;
        update(dbRef, newData).then(() => {
            this.setState({score: score});
        }).catch((err) => {
            console.error(err)
        })


    }


    render() {

        return (
            <section className="controlPanel">
                <div className="pointControl">
                    <div className="score">
                        <span className="score__label">punten</span>

                        <span className="score__value">{this.state.score}</span>
                    </div>
                    <button className="pointButton pointButton--decrease" onClick={()=>{this.changeScore(this.state.score - 1)}}> </button>
                    <button className="pointButton pointButton--increase" onClick={()=>{this.changeScore(this.state.score + 1)}}> </button>
                </div>

                {this.state.puzzles !== null
                ? this.state.puzzles
                : <LoadingIcon size={"large"}/>
                }
            </section>
        );
    }
}
