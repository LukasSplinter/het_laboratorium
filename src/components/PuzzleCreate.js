import React from "react";

import * as DATABASE from "../Database";

import "../styles/PuzzleCreate.scss";
import "../styles/PuzzleCard.scss";

import iconSave from "../assets/icon-save.svg";
import iconCancel from "../assets/icon-cancel.svg";
import iconDelete from "../assets/icon-delete.svg";
import iconConfirm from "../assets/icon-checkmark.svg";

export class PuzzleCreate extends React.Component {
    constructor(props) {
        super(props);
        this.inputName = React.createRef();
        this.inputWorth = React.createRef();
        this.inputDescription = React.createRef();
        this.state = {
            user_logged_in: this.props.user_logged_in,
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

    async createPuzzle() {
        //filter for empty values
        let values = Object.values(this.state.data);
        if (values.length < 3 || values.indexOf("") !== -1) {
            this.setState({saveFailure: true});
            setTimeout(() => {
                this.setState({saveFailure: false});
            }, 1000);

            return;
        }

        //regex operation to only keep numeric
        let internalName = this.state.data.name.replace(/[^0-9a-z]/gi, "");

        try {
            let response = DATABASE.setData("puzzles/" + internalName, this.state.data);

            //refresh puzzles
            this.props.refreshPuzzlesHook();

            //pop up succes feedback
            this.setState({ saveSuccesful: true });
            setTimeout(() => {
                this.setState({saveSuccesful: false, data:{}});

                this.inputName.current.value = "";
                this.inputWorth.current.value = "";
                this.inputDescription.current.value = "";
            }, 1000);

        } catch (err) {
            window.alert("Er is iets fout gegaan bij het opslaan, probeer het later opnieuw of refresh de pagina en kijk of de opdracht nog bestaat");
            console.error(err)
        }
    }

    render() {
        return (
            <article className={"puzzleCreate row " +
                (this.state.saveSuccesful ? "saveSuccesful" : "") +
                (this.state.saveFailure ? "saveFailure" : "")
            }>
                <div className="row">
                    <h1 className="title">Maak een opdracht aan:</h1>
                </div>
                
                <div className="row">
                    <div className="puzzlecard__value puzzlecard__value--name col-6">
                        <label htmlFor="name" className="puzzlecard__value__label">Naam</label>
                        <input id={"name"} name={"name"} type="text" className="puzzlecard__value__input puzzlecard__value--name__input"
                               disabled={!this.state.user_logged_in}
                               onChange={this.handleChange} ref={this.inputName}/>
                    </div>
                    <div className="puzzlecard__value col-4">
                        <label htmlFor="worth" className="puzzlecard__value__label">Puntenwaarde opdracht</label>
                        <input id={"worth"} name={"worth"} type="number" className="puzzlecard__value__input"
                               disabled={!this.state.user_logged_in}
                               onChange={this.handleChange} ref={this.inputWorth}/>
                    </div>
                </div>

                <div className="row puzzlecard__description">
                    <div className="puzzlecard__description__value col-12">
                        <label htmlFor="" className="puzzlecard__description__value__label">Uitleg opdracht</label>
                        <textarea name="description" id="description" ref={this.inputDescription}
                                  className={"puzzlecard__description__value__input"}
                                  disabled={!this.state.user_logged_in}
                                  onChange={this.handleChange}></textarea>
                    </div>
                </div>

                <button className="confirm button"
                        disabled={!this.state.user_logged_in}
                        onClick={this.createPuzzle.bind(this)}>
                    Voeg opdracht toe
                </button>
            </article>
        );
    }
}