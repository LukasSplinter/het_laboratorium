import React from 'react';
import { getData } from "../Database";

import { Modal } from "./Modal";

import "../styles/Header.scss";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.roomInput = React.createRef();
        this.state = {
            roomcode: (this.props.roomcode ? this.props.roomcode : ""),
            navOpen: false,
            modalOpen: this.props.activeWindow === "home" && !this.props.roomcode ? true : false,
            activeWindow: this.props.activeWindow,
            codeInput: null,
            school: "",
            classname: ""
        };
    }

    componentDidMount() {
        if (this.state.roomcode !== "") this.fetchSchoolData();
    }


    async fetchSchoolData() {
        try {
            let response = await getData("rooms/" + this.state.roomcode);

            this.setState({
                school: response.school,
                classname: response.name
            });
        } catch (err) {
            console.error(err)
        }
    }

    toggleNav() {
        let currentState = this.state.navOpen;
        this.setState({navOpen: !currentState});
    }

    toggleRoomPopup() {
        this.setState({modalOpen: !this.state.modalOpen});
    }

    render() {
        return (
            <header className="header row">
                <div className="header__bar col-12">
                    <button className={"header__bar__navigation " + (this.state.navOpen ? "close" : "")} onClick={this.toggleNav.bind(this)}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </button>
                    <div className="header__bar__roomcode">
                        <p className={"information"}>
                            <span className={"information__school"}>{this.state.school}</span>
                            <span className={"information__class"}>{this.state.classname}</span>
                        </p>
                        <button className="button" onClick={this.toggleRoomPopup.bind(this)}>
                            <h3>{this.state.roomcode !== "" ? this.state.roomcode : "xxxxx"}</h3>
                        </button>

                        {this.state.modalOpen &&
                            <div className="roomcode__tooltip">
                                <input type="text" placeholder={"sessiecode"} className={"input"} ref={this.roomInput}/>
                                <button className="button confirm" onClick={()=>{
                                    this.props.switchRoomHook(this.roomInput.current.value, this.roomInput.current);
                                }}>ga</button>
                            </div>
                        }

                    </div>

                </div>

                <div className={"nav " +
                    (this.state.navOpen ? "open " : "")}>
                    <ul className="nav__list">
                        <li className={
                            (this.state.activeWindow === "home" ? "active " : "")}
                            onClick={() => {
                            this.props.navigationHook("home");
                            this.setState({navOpen: false, activeWindow: "home"})
                        }}>
                            <h3>Beginscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "teacher" ? "active" : "" +
                            (this.state.roomcode !== "" ? "" : "noRoomCode ")}
                            onClick={() => {
                            this.props.navigationHook("teacher");
                            this.setState({navOpen: false, activeWindow: "teacher"})
                        }}>
                            <h3>Docentenscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "student" ? "active" : "" +
                            (this.state.roomcode !== "" ? "" : "noRoomCode ")}
                            onClick={() => {
                            this.props.navigationHook("student");
                            this.setState({navOpen: false, activeWindow: "student"})
                        }}>
                            <h3>Leerlingenscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "admin" ? "active" : ""}
                            onClick={() => {
                            this.props.navigationHook("admin");
                            this.setState({navOpen: false, activeWindow: "admin"})
                        }}>
                            <h3>Beheerscherm</h3>
                        </li>
                    </ul>
                </div>


            </header>
        );
    }
}
