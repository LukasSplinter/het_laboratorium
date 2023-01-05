import React from "react";

import * as DATABASE from "../Database";

export class RoomControl extends React.Component {
    constructor(props) {
        super(props);

        // Bind the event handlers to this component
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange(event) {
        // Update the state with the new value for the field being edited
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async handleDelete(roomKey) {
        try {
            let result = await DATABASE.removeNode("rooms/" + roomKey);
            console.log(result)
        } catch (err) {
            console.log(err)
        }

    }

    render() {
        const { name, school, score, date } = this.props;

        return (
            <div>
                <span className="roomKey">{this.props.roomKey}</span>
                <input name="name" value={name} onChange={this.handleChange} />
                <input name="school" value={school} onChange={this.handleChange} />
                <input name="score" value={score} onChange={this.handleChange} />
                <input name="date" value={date} onChange={this.handleChange} />
                <button onClick={this.handleDelete.bind(this, this.props.roomKey)}>Delete</button>
            </div>
        );
    }
}