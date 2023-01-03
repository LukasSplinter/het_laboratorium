import React from 'react';
import ReactDOM from 'react-dom';

// import "../styles/xx.scss";
import "../styles/screen.scss";

import { Title } from "./Title";

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <section className="home screen">
                <Title />

            </section>
        );
    }
}
