import React from 'react';

import { Modal } from "./Modal";

import "../styles/roomNav.scss";

export class RoomNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
            <section className={"roomNav"}>
                <button>Kamer aanmaken</button>
                <button>Code invoeren</button>
            </section>
        );
    }
}
