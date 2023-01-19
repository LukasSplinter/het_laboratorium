import React from 'react';

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import iconDelete from "../assets/icon-delete.svg"
import iconConfirm from "../assets/icon-checkmark.svg"
import iconCancel from "../assets/icon-cancel.svg"
import iconReorder from "../assets/icon-reorder.svg"
import "../styles/TextItem.scss";

export class TextItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteCheck: false,
            data: {
                text: this.props.text,
                order: this.props.order
            }
        };
    }

    async handleDelete() {
        try {
            let response = await DATABASE.removeNode("text/" + this.props.path + "/" + this.props.id);

            //function resolves true if delete succesful
            if (response == true) {
                this.props.refreshTextHook();
            }
        } catch (err) {
            console.error(err)
        }
    }

    handleChange(event) {
        // Update the state with the new value for the field being edited
        let { name, value } = event.target;
        let newData = this.state.data;
        newData[name]= value;
        this.setState({ data: newData });
    }

    async handleSave(element) {
        try {
            let response = await DATABASE.setData("text/" + this.props.path + "/" + this.props.id, this.state.data);

            //pop up succes feedback
            element.classList.add("success");
            setTimeout(() => {
                element.classList.remove("success")
            }, 1000);

        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <article className={"textItem row " +
                (this.state.deleteCheck ? "deleteCheck" : "")}
                     name={this.props.id}>

                <div className="drag col-2 col-lg-1">
                    <img className={"drag__icon"} src={iconReorder} alt="drag reorder icon" title={"sleep om de volgorde te veranderen"}/>
                </div>

                <div className="value col-9 col-lg-9">
                    <label htmlFor="text" className="label">Tekst</label>
                    <textarea className={"input input--textarea"}
                              name={"text"}
                              defaultValue={this.props.text}
                              onChange={this.handleChange.bind(this)}
                              onBlur={(e)=>{this.handleSave(e.target)}}/>
                </div>

                <div className="actions col-6 offset-6 col-lg-2 offset-lg-0">
                    {this.state.deleteCheck &&
                        <button className="actions__button actions__button--deleteConfirm"
                                onClick={this.handleDelete.bind(this)}
                                title={"Verwijder"}>
                            <img src={iconConfirm} alt="confirm icon" className="icon"/>
                        </button>
                    }
                    {this.state.deleteCheck
                        ?
                        <button className="actions__button actions__button--deleteCancel"
                                onClick={()=>{this.setState({deleteCheck: false})}}
                                title={"Niet verwijderen"}>
                            <img src={iconCancel} alt="cancel icon" className="icon"/>
                        </button>
                        :
                        <button className="actions__button actions__button--deleteCheck"
                                onClick={()=>{this.setState({deleteCheck: true})}}
                                title={"Verwijder deze tekst"}>
                            <img src={iconDelete} alt="delete icon" className="icon"/>
                        </button>
                    }
                </div>
            </article>
        );
    }
}

