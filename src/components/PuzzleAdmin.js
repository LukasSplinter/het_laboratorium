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
            data: this.props.data,
            user_logged_in: this.props.user_logged_in
        }

        // Bind the event handlers to this component
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props ) return;

        this.setState({
            user_logged_in: this.props.user_logged_in
        });
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
        } catch (err) {
            window.alert("Er is iets fout gegaan bij het verwijderen, probeer het later opnieuw of refresh de pagina en kijk of de opdracht nog bestaat");
            console.error(err)
        }

        this.props.refreshPuzzlesHook();
    }

    async handleSave(puzzleName, element) {
        if (this.state.data === undefined) return
        try {
            let response = await DATABASE.updateData("puzzles/" + puzzleName, this.state.data)

            //pop up succes feedback
            element.classList.add("success");
            setTimeout(() => {
                element.classList.remove("success")
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
                    <div className="puzzlecard__value puzzlecard__value--name col-6 order-2 order-lg-1">
                        <label htmlFor="name" className="puzzlecard__value__label">Naam</label>
                        <input id={"name"} name={"name"} type="text" className="puzzlecard__value__input puzzlecard__value--name__input"
                               defaultValue={name}
                               disabled={!this.state.user_logged_in}
                               onChange={this.handleChange}
                               onBlur={(e)=>{this.handleSave(this.props.puzzleID, e.target)}}/>
                    </div>
                    <div className="puzzlecard__value col-6 col-lg-4 order-3 order-lg-2">
                        <label htmlFor="worth" className="puzzlecard__value__label">Puntenwaarde opdracht</label>
                        <input id={"worth"} name={"worth"} type="number" className="puzzlecard__value__input"
                               defaultValue={worth}
                               disabled={!this.state.user_logged_in}
                               onChange={this.handleChange}
                               onBlur={(e)=>{this.handleSave(this.props.puzzleID, e.target)}}/>
                    </div>
                    <div className="actions col-4 offset-8 col-lg-2 mb-5 order offset-lg-0 mb-lg-0 order-1 order-lg-3">
                        {this.state.deleteCheck &&
                            <button title={"verwijder sessie niet"} className={"actions__button actions__button--deleteCancel"}
                                    disabled={!this.state.user_logged_in}
                                      onClick={()=>{this.setState({deleteCheck: false})}}>
                                <img className={"icon"} src={iconCancel} alt="cancel icon"/>
                            </button>
                        }

                        {this.state.deleteCheck == false
                            ? <button title={"verwijder deze sessie"} className={"actions__button actions__button--deleteCheck"}
                                      disabled={!this.state.user_logged_in}
                                      onClick={()=>{this.setState({deleteCheck: true})}}>
                                <img className={"icon"} src={iconDelete} alt="delete icon"/>
                            </button>
                            : <button title={"verwijder sessie wel"} className={"actions__button actions__button--deleteConfirm"}
                                      disabled={!this.state.user_logged_in}
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
                                  disabled={!this.state.user_logged_in}
                                  className={"puzzlecard__description__value__input"}
                                  defaultValue={description}
                                  onChange={this.handleChange}
                                  onBlur={(e)=>{this.handleSave(this.props.puzzleID, e.target)}}/>
                    </div>
                </div>

            </article>
        );
    }
}