import React from 'react';

// import "../styles/xx.scss";
import iconDelete from "../assets/icon-delete.svg"
import iconConfirm from "../assets/icon-checkmark.svg"
import iconCancel from "../assets/icon-cancel.svg"
import iconReorder from "../assets/icon-reorder.svg"
import "../styles/TextItem.scss";
import {removeNode, setData} from "../Database";

export class TextItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_logged_in: this.props.user_logged_in,
            deleteCheck: false,
            data: {
                text: this.props.text,
                order: this.props.order,
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props ) return;

        this.setState({
            user_logged_in: this.props.user_logged_in
        });
    }

    async handleDelete() {
        try {
            let response = await removeNode("text/" + this.props.path + "/" + this.props.id);
        } catch (err) {
            console.error(err)
        }
        this.props.refreshTextHook();
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
            let response = await setData("text/" + this.props.path + "/" + this.props.id, this.state.data);

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
                    {this.state.user_logged_in &&
                        <img className={"drag__icon"} src={iconReorder} alt="drag reorder icon" title={"sleep om de volgorde te veranderen"}/>
                    }
                </div>

                <div className="value col-9 col-lg-9">
                    <label htmlFor="text" className="label">Tekst</label>
                    <textarea className={"input input--textarea"}
                              name={"text"}
                              disabled={!this.state.user_logged_in}
                              defaultValue={this.props.text}
                              onChange={this.handleChange.bind(this)}
                              onBlur={(e)=>{this.handleSave(e.target)}}/>
                </div>

                <div className="actions col-6 offset-6 col-lg-2 offset-lg-0 mt-5 mt-lg-0">
                    {this.state.deleteCheck &&
                        <button name={"akkord verwijderen"}
                                className="actions__button actions__button--deleteConfirm"
                                disabled={!this.state.user_logged_in}
                                onClick={this.handleDelete.bind(this)}
                                title={"Verwijder"}>
                            <img src={iconConfirm} alt="confirm icon" className="icon"/>
                        </button>
                    }
                    {this.state.deleteCheck
                        ?
                        <button name={"cancel verwijderen"}
                                className="actions__button actions__button--deleteCancel"
                                disabled={!this.state.user_logged_in}
                                onClick={()=>{this.setState({deleteCheck: false})}}
                                title={"Niet verwijderen"}>
                            <img src={iconCancel} alt="cancel icon" className="icon"/>
                        </button>
                        :
                        <button name={"tekstartikel verwijderen"}
                                className="actions__button actions__button--deleteCheck"
                                disabled={!this.state.user_logged_in}
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

