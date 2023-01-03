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
            puzzles: null
        };
    }


    componentDidMount() {
        this.fetchPuzzles(this.state.roomcode, this.state.db);
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

        }).catch((err) => {
            console.error(err);
        })
    }


    render() {

        return (
            <section className="controlPanel">
                {this.state.puzzles !== null
                ? this.state.puzzles
                : <LoadingIcon />
                }
            </section>
        );
    }
}
