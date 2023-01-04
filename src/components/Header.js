import React from 'react';

import { Modal } from "./Modal";

import "../styles/Header.scss";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.roomInput = React.createRef();
        this.state = {
            roomcode: (this.props.roomcode ? this.props.roomcode : "000"),
            navOpen: false,
            modalOpen: false,
            activeWindow: this.props.activeWindow,
            codeInput: null,
            db: this.props.db
        };
    }

    toggleNav() {
        let currentState = this.state.navOpen;
        this.setState({navOpen: !currentState});
    }

    openRoomModal() {
        this.setState({modalOpen: true});
    }
    closeRoomModal() {
        this.setState({modalOpen: false});
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
                    <button className="header__bar__roomcode" onClick={this.openRoomModal.bind(this)}>
                        <h3>{this.state.roomcode}</h3>
                    </button>
                </div>

                <div className={"nav " + (this.state.navOpen ? "open" : "")}>
                    <ul className="nav__list">
                        <li className={this.state.activeWindow === "home" ? "active" : ""} onClick={() => {
                            this.props.navigationHook("home");
                            this.setState({navOpen: false, activeWindow: "home"})
                        }}>
                            <h3>Beginscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "teacher" ? "active" : ""} onClick={() => {
                            this.props.navigationHook("teacher");
                            this.setState({navOpen: false, activeWindow: "teacher"})
                        }}>
                            <h3>Docentenscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "student" ? "active" : ""} onClick={() => {
                            this.props.navigationHook("student");
                            this.setState({navOpen: false, activeWindow: "student"})
                        }}>
                            <h3>Leerlingenscherm</h3>
                        </li>
                    </ul>
                </div>

                {this.state.modalOpen &&
                    <Modal opened="true" hasCloseButton={"true"} onCloseHook={this.closeRoomModal.bind(this)}>
                        <h2>Voer de code van een kamer in</h2>
                        <div>
                            <input type="text" className={"input"} ref={this.roomInput}/>
                            <button className="button confirm" onClick={()=>{
                                this.props.switchRoomHook(this.roomInput.current.value, this.roomInput.current);
                            }}>gereed</button>
                        </div>
                    </Modal>
                }

            </header>
        );
    }
}
