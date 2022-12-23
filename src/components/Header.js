import React from 'react';
import ReactDOM from 'react-dom';

import "../styles/Header.scss";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: (this.props.roomcode ? this.props.roomcode : "0000"),
            navOpen: false,
        };
    }

    render() {
        const toggleNav = e => {
            let currentState = this.state.navOpen;
            this.setState({navOpen: !currentState});
        }

        const switchRoomCode = e => {
            console.log('You clicked roomcode.');
        }

        return (
            <header className="header">
                <div className="header__bar">
                    <button className={"header__bar__navigation " + (this.state.navOpen ? "close" : "")} onClick={toggleNav}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </button>
                    <button className="header__bar__roomcode" onClick={switchRoomCode}>
                        <h3>{this.state.roomcode}</h3>
                    </button>
                </div>

                <div className={"nav " + (this.state.navOpen ? "open" : "")}>
                    <ul className="nav__list">
                        <li onClick={() => {this.props.navigationHook("home"); this.setState({navOpen: false})}}>
                            <h3>Beginscherm</h3>
                        </li>
                        <li onClick={() => {this.props.navigationHook("teacher"); this.setState({navOpen: false})}}>
                            <h3>Docentenscherm</h3>
                        </li>
                        <li onClick={() => {this.props.navigationHook("student"); this.setState({navOpen: false})}}>
                            <h3>Leerlingenscherm</h3>
                        </li>
                    </ul>
                </div>
            </header>
        );
    }
}
