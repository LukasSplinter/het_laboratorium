import React from "react";

import * as DATABASE from "../Database";

import iconSave from "../assets/icon-save.svg";

import "../styles/SettingAdmin.scss";

export class SettingAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saveSuccesful: false,
            data: this.props.data,
            user_logged_in: this.props.user_logged_in
        }

        // Bind the event handlers to this component
        this.handleChange = this.handleChange.bind(this);
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
        let settingData = this.state.data;
        settingData[name]= value;
        this.setState({ data: settingData });
    }

    async handleSave(settingname, element) {
        try {
            let response = await DATABASE.updateData("settings/" + settingname, this.state.data);

            //pop up succes feedback
            element.classList.add("success");
            setTimeout(() => {
                element.classList.remove("success")
            }, 1000);

        } catch (err) {
            window.alert("Er is iets fout gegaan bij het opslaan, probeer het later opnieuw!");
            console.error(err)
        }
    }

    render() {
        const { name, value } = this.props.data;

        return (
            <article className={"setting row " +
                (this.state.saveSuccesful ? "saveSuccesful" : "")
            }>

                <div className="setting__info col-8 col-lg-5">
                    <label className={"setting__value__label"} htmlFor="name">Instelling:</label>
                    <p id={"name"} name={"naam"} className="setting__info__name">{name}</p>
                </div>

                <div className="setting__value col-4 col-lg-4">
                    <label className={"setting__value__label"} htmlFor="value">Waarde:</label>
                    <input id={"value"} className={"setting__value__input"} name="value" defaultValue={value}
                           type={"number"}
                           disabled={!this.state.user_logged_in}
                           onChange={this.handleChange}
                           onBlur={(e)=>{this.handleSave(this.props.id, e.target)}}/>
                </div>
            </article>
        );
    }
}