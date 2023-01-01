import React from 'react';
import ReactDOM from 'react-dom';

// import "../styles/xx.scss";
import { ModalRoom } from './ModalRoom'

export class Teacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <section className="Teacher">
                <h1>Teacher</h1>
                <ModalRoom opened="true"/>
            </section>
        );
    }
}
