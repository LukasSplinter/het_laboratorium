import React from 'react';
import ReactDOM from 'react-dom';

// import "../styles/xx.scss";
import "../styles/screen.scss";
import { ModalRoom } from './ModalRoom';
import { Title } from './Title';
import { ControlPanel } from './ControlPanel';



export class Teacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: this.props.roomcode
        };
    }

    render() {
        return (
            <section className="Teacher screen">
                <Title />

                <ControlPanel db={this.props.db} roomcode={this.state.roomcode}/>
            </section>
        );
    }
}
