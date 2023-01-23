import React from 'react';

import "../styles/title.scss";
import { Modal } from "./Modal"

export class Title extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: this.props.opened,
        };
    }

    render() {
        return (
            <section className="title">
                <h1>STROOM</h1>
                <h1>GEEFT</h1>
                <h1>ENERGIE</h1>
            </section>
        );
    }
}
