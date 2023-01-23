import React from 'react';

// import "../styles/xx.scss";
import "../styles/NoContent.scss";
import undrawOffroad from "../assets/undraw_offroad.svg";
import undrawTree from "../assets/undraw_tree_swing.svg";
import undrawWriter from "../assets/undraw_writer.svg";

export class NoContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text
        };
        this.selectedSVG = [undrawOffroad, undrawWriter, undrawTree][Math.floor(Math.random() * 3)]
    }


    render() {
        return (
            <section className={"NoContent"}>
                <div className="NoContent__art">
                    <img src={this.selectedSVG} alt={"Een rustige afbeelding - " + this.state.text}/>
                </div>
                <div className="NoContent__message">
                    <p>{this.state.text}</p>
                </div>
            </section>
        );
    }
}

