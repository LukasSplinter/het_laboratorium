import React from 'react';

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/TextItem.scss";

export class TextItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    handleChange(event) {
        // Update the state with the new value for the field being edited
        let { name, value } = event.target;
        let newData = this.state.data;
        newData[name]= value;
        this.setState({ data: newData });
    }

    async handleDelete(id) {
        try {
            let result = await DATABASE.removeNode("text/" + this.props.path + "/" + id);

            //function resolves true if delete succesful
            if (result == true) {
                this.props.refreshTextHook();
            }
        } catch (err) {
            console.error(err)
        }

    }

    async handleSave(puzzleName) {
        try {
            let response = await DATABASE.updateData("text/" + this.props.path + "/" + id, this.state.data)

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
        return (
            <article className={"textItem"}>
                <div className="controlbar">
                    <div className="value">
                        <label htmlFor="order" className={"value__label"}>Volgorde</label>
                        <input id={"order"} name={"order"} type="text" className={"value__input"}
                               defaultValue={this.props.order} onChange={this.handleChange.bind(this)}/>
                    </div>

                </div>
                <div className="content">
                    <div className="value">
                        <label htmlFor="text" className={"value__label"}>Tekst</label>
                        <textarea id={"text"} name={"text"} className={"value__input"}
                                  defaultValue={this.props.text} onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
            </article>
        );
    }
}

