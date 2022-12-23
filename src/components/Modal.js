import React from 'react';
import ReactDOM from 'react-dom';

import "../styles/Modal.scss";

export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: this.props.opened,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props == prevProps) {
            return;
        }

        this.setState({opened: this.props.opened})
    }

    render() {
        return (
            <section className={
                "modal " +
                (this.state.opened ? "open" : "") +
                (this.props.classNames ? " " + this.props.classNames : "")}>
                
                <div className="modal__window container">
                    <div class="image d-none d-md-block col-4">
                        {/*image here*/}
                    </div>
                    <div class="content col-8">
                        {this.props.children}
                    </div>
                </div>
            </section>
        );
    }
}
