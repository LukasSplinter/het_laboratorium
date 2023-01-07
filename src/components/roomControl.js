import React from "react";

import * as DATABASE from "../Database";

import iconSave from "../assets/icon-save.svg";
import iconDelete from "../assets/icon-delete.svg";
import iconConfirm from "../assets/icon-checkmark.svg";
import iconCancel from "../assets/icon-cancel.svg";

import "../styles/roomControl.scss";

export class RoomControl extends React.Component {
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
        let roomData = this.state.data;
        roomData[name]= value;
        this.setState({ data: roomData });
    }

    async handleDelete(roomKey) {
        try {
            let result = await DATABASE.removeNode("rooms/" + roomKey);

            //function resolves true if delete succesful
            if (result == true) {
                this.props.refreshRoomsHook();
            }
        } catch (err) {
            console.error(err)
        }

    }

    async handleSave(roomKey) {
        try {
            let response = await DATABASE.updateRoom(roomKey, this.state.data)

            //pop up succes feedback
            this.setState({ saveSuccesful: true });
            setTimeout(() => {
                this.setState({saveSuccesful: false})
            }, 1000);

        } catch (err) {
            window.alert("Er is iets fout gegaan bij het opslaan, probeer het later opnieuw of kijk of de sessie nog bestaat");
            console.error(err)
        }
    }

    render() {
        const { name, school, score, date } = this.props;

        return (
            <article className={"room row " +
                (this.state.deleteCheck ? "deleteCheck " : "") +
                (this.state.saveSuccesful ? "saveSuccesful" : "")
            }>
                <div className="room__info">
                    <p className={"room__info__roomcode"}>sessiecode: "<span className={"value"}>{this.props.roomKey}"</span></p>
                    <p className="room__info__date">datum: "<span className={"value"}>{this.props.date}"</span></p>
                </div>

                <div className="room__value col-6 col-md-3">
                    <label className={"room__value__label"} htmlFor="name">klasnaam</label>
                    <input id={"name"} className={"room__value__input"} name="name" defaultValue={name} onChange={this.handleChange} />
                </div>

                <div className="room__value col-6 col-md-3">
                    <label className={"room__value__label"} htmlFor="school">schoolnaam</label>
                    <input id={"school"} className={"room__value__input"} name="school" defaultValue={school} onChange={this.handleChange} />
                </div>

                <div className="room__value col-6 col-md-3">
                    <label className={"room__value__label"} htmlFor="score">aantal punten</label>
                    <input id={"score"} className={"room__value__input"} name="score" defaultValue={score} onChange={this.handleChange} />
                </div>

                <div className="actions col-6 col-md-2 offset-md-1">
                    {this.state.deleteCheck == false
                        ? <button title={"sla veranderingen op"} className={"room__actions__button room__actions__button--save"} onClick={this.handleSave.bind(this, this.props.roomKey)}>
                            <img className={"icon"} src={iconSave} alt="save icon"/>
                        </button>
                        : <button title={"verwijder sessie niet"} className={"room__actions__button room__actions__button--deleteCancel"} onClick={()=>{this.setState({deleteCheck: false})}}>
                            <img className={"icon"} src={iconCancel} alt="cancel icon"/>
                        </button>
                    }

                    {this.state.deleteCheck == false
                        ? <button title={"verwijder deze sessie"} className={"room__actions__button room__actions__button--deleteCheck"} onClick={()=>{this.setState({deleteCheck: true})}}>
                            <img className={"icon"} src={iconDelete} alt="delete icon"/>
                        </button>
                        : <button title={"verwijder sessie wel"} className={"room__actions__button room__actions__button--deleteConfirm"} onClick={this.handleDelete.bind(this, this.props.roomKey)}>
                            <img className={"icon"} src={iconConfirm} alt="confirm delete icon"/>
                        </button>
                    }
                </div>

            </article>
        );
    }
}