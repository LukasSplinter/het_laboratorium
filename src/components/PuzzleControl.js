import React from 'react';
import ReactDOM from 'react-dom';

import { ref, child, get, set} from "firebase/database";

import { Modal } from "./Modal";

import "../styles/puzzleControl.scss";
import iconInformation from '../assets/icon-information.svg';

export class PuzzleControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            db: this.props.db,
            pointsClicked: false,
            description: "closed"
        };
    }

    //open a modal with information on the puzzle
    openPuzzleInformation () {
        this.setState({description: "open"});
    }

    closePuzzleInformation () {
        this.setState({description: "closed"});
    }

    render() {
        return (
            <article className="puzzleControl">
                <div className="puzzleControl__counter"><span>{this.props.counter}</span></div>
                <h3 className="puzzleControl__name">{this.props.name}</h3>

                <button disabled={this.state.pointsClicked}
                className={"puzzleControl__reward " + (this.state.pointsClicked ? "success" : "")}
                onClick={ () => {
                    this.props.awardPointsHook(this.props.data.worth);
                    this.setState({pointsClicked: true});
                    setTimeout(()=>{this.setState({pointsClicked: false})}, 1000);
                    }}>Keur goed</button>

                <button className="puzzleControl__info"
                onClick={this.openPuzzleInformation.bind(this)}>
                    <img src={iconInformation} alt="information icon"/>
                </button>

                <Modal hasCloseButton="true"
                onCloseHook={this.closePuzzleInformation.bind(this)}
                opened={this.state.description === "open" ? true : false}>
                    <h2>{this.props.data.name}</h2>
                    <p>{this.props.data.description}</p>
                </Modal>
            </article>
        );
    }
}
