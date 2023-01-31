import React from "react";;

import "../styles/PuzzleCreate.scss";
import "../styles/PuzzleCard.scss";
import {pushChild} from "../Database";

export class TextCreate extends React.Component {
    constructor(props) {
        super(props);
        this.inputText = React.createRef();
        this.state = {
            data: {order: -1}
        }

        // Bind the event handlers to this component
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        // Update the state with the new value for the field being edited
        let { name, value } = event.target;

        if (value !== "") {
            event.target.classList.remove("failure");

            let newData = this.state.data;
            newData[name]= value;
            this.setState({ data: newData });

        } else {
            event.target.classList.add("failure");
        }
    }

    async createText() {
        //filter for empty values
        let values = Object.values(this.state.data);
        if (values.length < 2 || values.indexOf("") !== -1) {
            this.setState({saveFailure: true});
            setTimeout(() => {
                this.setState({saveFailure: false});
            }, 1000);

            return;
        }

        try {
            let response = pushChild("text/" + this.props.path, this.state.data);

            //refresh puzzles
            this.props.refreshTextHook();

            //pop up succes feedback
            this.setState({ saveSuccesful: true });
            setTimeout(() => {
                this.setState({saveSuccesful: false, data:{order: -1}});

                this.inputText.current.value = "";
            }, 1000);

        } catch (err) {
            window.alert("Er is iets fout gegaan bij het opslaan, probeer het later opnieuw of refresh de pagina en kijk of de opdracht nog bestaat");
            console.error(err)
        }
    }

    render() {
        return (
            <article className={"puzzleCreate row " +
                (this.state.saveSuccesful ? "saveSuccesful" : "")
            }>
                <div className="row">
                    <h1 className="title">Voeg een tekstartikel toe:</h1>
                </div>

                <div className="row puzzlecard__description">
                    <div className="puzzlecard__description__value col-12">
                        <label htmlFor="text" className="puzzlecard__description__value__label">Tekst</label>
                        <textarea name="text" id="text" ref={this.inputText}
                                  className={"puzzlecard__description__value__input"}
                                  onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>

                <button name={"maak tekstartikel aan"}
                        className="confirm button"
                        onClick={this.createText.bind(this)}>
                    Voeg tekst toe
                </button>
            </article>
        );
    }
}