import React from "react";

import * as DATABASE from "../Database";

import "../styles/PuzzleCreate.scss";
import "../styles/PuzzleCard.scss";

import iconSave from "../assets/icon-save.svg";
import iconCancel from "../assets/icon-cancel.svg";
import iconDelete from "../assets/icon-delete.svg";
import iconConfirm from "../assets/icon-checkmark.svg";

export class TextCreate extends React.Component {
    constructor(props) {
        super(props);
        this.inputOrder = React.createRef();
        this.inputText = React.createRef();
        this.state = {
            data: {}
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
            let response = DATABASE.pushChild("text/" + this.props.path, this.state.data);

            //refresh puzzles
            this.props.refreshTextHook(response.key);

            //pop up succes feedback
            this.setState({ saveSuccesful: true });
            setTimeout(() => {
                this.setState({saveSuccesful: false, data:{}});

                this.inputText.current.value = "";
                this.inputOrder.current.value = "";
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

                <div className="row">
                    <div className="puzzlecard__value col-4">
                        <label htmlFor="order" className="puzzlecard__value__label">Nummer van volgorde</label>
                        <input id={"order"} name={"order"} type="number" className="puzzlecard__value__input"
                               onChange={this.handleChange.bind(this)} ref={this.inputOrder}/>
                    </div>
                </div>

                <div className="row puzzlecard__description">
                    <div className="puzzlecard__description__value col-12">
                        <label htmlFor="text" className="puzzlecard__description__value__label">Tekst</label>
                        <textarea name="text" id="text" ref={this.inputText}
                                  className={"puzzlecard__description__value__input"}
                                  onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>

                <button className="confirm button"
                        onClick={this.createText.bind(this)}>
                    Voeg tekst toe
                </button>
            </article>
        );
    }
}