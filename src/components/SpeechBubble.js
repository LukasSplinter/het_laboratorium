import React from "react";

// import "../styles/xx.scss";
import "../styles/SpeechBubble.scss";


export class SpeechBubble extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.color ? this.props.color : "#ef8701"
        };
    }


    render() {
        return (
            <div className={"speechbubble"}>

                <svg className={"speechbubble__background"} fill={this.state.color} width="465" height="553" viewBox="0 0 465 553" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio={"none"}>
                    <path fill={this.state.color} fillRule="evenodd" clipRule="evenodd" d="M248.984 1.33511C328.699 10.2909 376.204 86.5637 418.875 154.489C454.038 210.463 473.409 273.426 460.658 338.287C447.362 405.924 409.781 465.683 350.715 501.22C283.473 541.676 200.159 572.212 129.877 537.301C60.1917 502.687 46.1172 416.07 27.2973 340.572C7.74098 262.119 -20.8548 177.739 23.375 110.056C71.4205 36.5342 161.704 -8.47045 248.984 1.33511Z"/>
                </svg>

                <div className="speechbubble__content">
                    {this.props.children}
                </div>

                <svg className={"speechbubble__tail"} fill={this.state.color} width="250" height="272" viewBox="0 0 250 272" xmlns="http://www.w3.org/2000/svg">
                    <path fill={this.state.color} d="M249.5 0H0C0 29.6 68 18.5 92.5 271.5C103.5 68.5 182.333 16 249.5 0Z"/>
                </svg>

            </div>

        );
    }
}
