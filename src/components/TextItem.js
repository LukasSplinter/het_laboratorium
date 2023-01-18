import React from 'react';

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import iconDelete from "../assets/icon-delete.svg"
import "../styles/TextItem.scss";

export class TextItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    render() {
        return (
            <p>{this.props.text}</p>
        );
    }
}

