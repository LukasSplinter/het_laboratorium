import React from 'react';
import ReactDOM from 'react-dom';

import "../styles/Header.scss";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {roomcode: this.props.roomcode};
    }

    render() {
        const toggleNav = e => {
            console.log('You clicked nav.');
        }

        const switchRoomCode = e => {
            console.log('You clicked roomcode.');
        }

        return (
            <header className="header">
                <button className="header__navigation" onClick={toggleNav}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </button>
                <button className="header__roomcode" onClick={switchRoomCode}>
                    <h3>{this.state.roomcode}</h3>
                </button>
                <div className="nav">
                    <ul classname="nav">
                        <li></li>
                    </ul>
                </div>
            </header>
        );
    }
}
