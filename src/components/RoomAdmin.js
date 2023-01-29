import React from "react";

import * as DATABASE from "../Database";

import iconSave from "../assets/icon-save.svg";
import iconDelete from "../assets/icon-delete.svg";
import iconConfirm from "../assets/icon-checkmark.svg";
import iconCancel from "../assets/icon-cancel.svg";

import "../styles/RoomAdmin.scss";

export class RoomAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.initalState = this.props.data;
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
        } catch (err) {
            console.error(err)
        }

        this.props.refreshRoomsHook();

    }

    async handleSave(roomKey, element) {
        if (this.state.data[element.name] === undefined) return
        try {
            let response = await DATABASE.updateRoom(roomKey, this.state.data)

            //pop up succes feedback
            element.classList.add("success");
            setTimeout(() => {
                element.classList.remove("success")
            }, 1000);

        } catch (err) {
            window.alert("Er is iets fout gegaan bij het opslaan, probeer het later opnieuw of kijk of de sessie nog bestaat");
            console.error(err)
        }
    }

    render() {
        const { name, school, score, date } = this.props.data;

        return (
            <article className={"room row " +
                (this.state.deleteCheck ? "deleteCheck " : "")
            }>
                <div className="room__info">
                    <p className={"room__info__roomcode"}>sessiecode: "<span className={"value"}>{this.props.roomKey}"</span></p>
                    <p className="room__info__date">datum: "<span className={"value"}>{date}"</span></p>
                </div>

                <div className="room__value col-6 col-lg-3">
                    <label className={"room__value__label"} htmlFor="name">klasnaam</label>
                    <input id={"name"} className={"room__value__input"} name="naam" defaultValue={name}
                           disabled={!this.state.user_logged_in}
                           onChange={this.handleChange}
                           onBlur={(e)=>{this.handleSave(this.props.roomKey, e.target)}}/>
                </div>

                <div className="room__value col-6 col-lg-3">
                    <label className={"room__value__label"} htmlFor="school">schoolnaam</label>
                    <input id={"school"} className={"room__value__input"} name="school" defaultValue={school}
                           disabled={!this.state.user_logged_in}
                           onChange={this.handleChange}
                           onBlur={(e)=>{this.handleSave(this.props.roomKey, e.target)}}/>
                </div>

                <div className="room__value col-6 col-lg-3 mt-5 mt-lg-0">
                    <label className={"room__value__label"} htmlFor="score">aantal punten</label>
                    <input id={"score"} className={"room__value__input"} name="score" defaultValue={score}
                           disabled={!this.state.user_logged_in}
                           onChange={this.handleChange}
                           onBlur={(e)=>{this.handleSave(this.props.roomKey, e.target)}}/>
                </div>

                <div className="room__actions col-6 col-lg-2 offset-lg-1 mt-5 mt-lg-0">
                    {this.state.deleteCheck &&
                        <button title={"verwijder sessie niet"} className={"room__actions__button room__actions__button--deleteCancel"}
                                onClick={()=>{this.setState({deleteCheck: false})}}
                                disabled={!this.state.user_logged_in}>
                            <img className={"icon"} src={iconCancel} alt="cancel icon"/>
                        </button>
                    }

                    {this.state.deleteCheck == false
                        ? <button title={"verwijder deze sessie"} className={"room__actions__button room__actions__button--deleteCheck"}
                                  disabled={!this.state.user_logged_in}
                                  onClick={()=>{this.setState({deleteCheck: true})}}>
                            <img className={"icon"} src={iconDelete} alt="delete icon"/>
                        </button>
                        : <button title={"verwijder sessie wel"} className={"room__actions__button room__actions__button--deleteConfirm"}
                                  disabled={!this.state.user_logged_in}
                                  onClick={this.handleDelete.bind(this, this.props.roomKey)}>
                            <img className={"icon"} src={iconConfirm} alt="confirm delete icon"/>
                        </button>
                    }
                </div>

            </article>
        );
    }
}