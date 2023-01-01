import React from 'react';
import ReactDOM from 'react-dom';

// import "../styles/xx.scss";
import { Modal } from "./Modal"

export class ModalRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: this.props.opened,
        };
    }

    render() {
        return (
            <Modal opened={this.state.opened} hasCloseButton={this.props.hasCloseButton}>
                <h2>test</h2>
            </Modal>
        );
    }
}
