import React from 'react';
import ReactDOM from 'react-dom';

// import "../styles/xx.scss";
import "../styles/screen.scss";

export class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <section className="student screen">
                <h1>Student</h1>
            </section>
        );
    }
}
