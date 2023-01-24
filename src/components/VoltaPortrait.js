import React from "react";

import VoltaImage from "../assets/volta-portrait.png";
import {SpeechBubble} from "./SpeechBubble";


// import "../styles/xx.scss";
import "../styles/VoltaPortrait.scss";


export class VoltaPortrait extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogue: this.props.dialogue,
            dialogueColor: this.props.dialogueColor,
            focussed: this.props.focussed
        };
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps == this.props) return;

        this.setState({
            dialogue: this.props.dialogue,
            dialogueColor: this.props.dialogueColor,
            focussed: this.props.focussed
        });
    }


    render() {
        return (
            <div className={"VoltaPortrait " +
                (this.state.focussed ? "focussed" : "")}>
                <img className={"img"}
                     src={VoltaImage} alt="portrait of Alessandro Volta"/>

                {this.state.dialogue !== "" &&
                    <SpeechBubble color={this.state.dialogueColor ? this.state.dialogueColor : ""}>{this.state.dialogue}</SpeechBubble>
                }
            </div>
        );
    }
}
