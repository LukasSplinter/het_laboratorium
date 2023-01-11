import React from "react";

import * as DATABASE from "../Database";

import iconSave from "../assets/icon-save.svg";
import iconDelete from "../assets/icon-delete.svg";
import iconConfirm from "../assets/icon-checkmark.svg";
import iconCancel from "../assets/icon-cancel.svg";

import "../styles/PuzzleCard.scss";

export class PuzzleAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteCheck: false,
            saveSuccesful: false,
            data: this.props.data
        }

        // Bind the event handlers to this component
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange(event) {
        // Update the state with the new value for the field being edited
        let { name, value } = event.target;
        let newData = this.state.data;
        newData[name]= value;
        this.setState({ data: newData });
    }

    async handleDelete(puzzleName) {
        try {
            let result = await DATABASE.removeNode("puzzles/" + puzzleName);

            //function resolves true if delete succesful
            if (result == true) {
                    this.props.refreshPuzzlesHook();
            }
        } catch (err) {
            console.error(err)
        }

    }

    async handleSave(puzzleName) {
        try {
            let response = await DATABASE.updateData("puzzles/" + puzzleName, this.state.data)

            //pop up succes feedback
            this.setState({ saveSuccesful: true });
            setTimeout(() => {
                this.setState({saveSuccesful: false})
            }, 1000);

        } catch (err) {
            window.alert("Er is iets fout gegaan bij het opslaan, probeer het later opnieuw of refresh de pagina en kijk of de opdracht nog bestaat");
            console.error(err)
        }
    }

    render() {
        const { name, worth, description } = this.props.data;

        return (
            <article className={"puzzlecard row " +
                (this.state.deleteCheck ? "deleteCheck " : "") +
                (this.state.saveSuccesful ? "saveSuccesful" : "")
            }>
                <div className="row">
                    <div className="puzzlecard__value puzzlecard__value--name col-6">
                        <label htmlFor="name" className="puzzlecard__value__label">Naam</label>
                        <input id={"name"} name={"name"} type="text" className="puzzlecard__value__input puzzlecard__value--name__input"
                               defaultValue={name} onChange={this.handleChange}/>
                    </div>
                    <div className="puzzlecard__value col-4">
                        <label htmlFor="worth" className="puzzlecard__value__label">Puntenwaarde opdracht</label>
                        <input id={"worth"} name={"worth"} type="number" className="puzzlecard__value__input"
                               defaultValue={worth} onChange={this.handleChange}/>
                    </div>
                    <div className="actions col-2">
                        {this.state.deleteCheck == false
                            ? <button title={"sla veranderingen op"} className={"room__actions__button room__actions__button--save"}
                                      onClick={this.handleSave.bind(this, this.props.puzzleID)}>
                                <img className={"icon"} src={iconSave} alt="save icon"/>
                            </button>
                            : <button title={"verwijder sessie niet"} className={"room__actions__button room__actions__button--deleteCancel"}
                                      onClick={()=>{this.setState({deleteCheck: false})}}>
                                <img className={"icon"} src={iconCancel} alt="cancel icon"/>
                            </button>
                        }

                        {this.state.deleteCheck == false
                            ? <button title={"verwijder deze sessie"} className={"room__actions__button room__actions__button--deleteCheck"}
                                      onClick={()=>{this.setState({deleteCheck: true})}}>
                                <img className={"icon"} src={iconDelete} alt="delete icon"/>
                            </button>
                            : <button title={"verwijder sessie wel"} className={"room__actions__button room__actions__button--deleteConfirm"}
                                      onClick={this.handleDelete.bind(this, this.props.puzzleID)}>
                                <img className={"icon"} src={iconConfirm} alt="confirm delete icon"/>
                            </button>
                        }
                    </div>
                </div>

                <div className="row puzzlecard__description">
                    <div className="puzzlecard__description__value col-12">
                        <label htmlFor="" className="puzzlecard__description__value__label">Uitleg opdracht</label>
                        <textarea name="description" id="description"
                                  className={"puzzlecard__description__value__input"}
                                  defaultValue={description} onChange={this.handleChange}></textarea>
                    </div>
                </div>

            </article>
        );
    }
}