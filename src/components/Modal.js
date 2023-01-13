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
        if (this.props === prevProps) {
            return;
        }

        this.setState({opened: this.props.opened})
    }


    modalClose(e) {
        this.setState({opened:false});
        this.props.onCloseHook();
    };

    preventModalClose(e) {
        e.stopPropagation();
    };

    render() {
        return (
            <section className={
                "modal " +
                (this.state.opened ? "open" : "") +
                (this.props.classNames ? " " + this.props.classNames : "")}
            onClick={this.modalClose.bind(this)}>

                <div className="modal__window container"
                onClick={this.preventModalClose}>
                    <div className="image d-none d-md-block col-4">
                        {/*image here*/}
                    </div>
                    <div className="content col-12 d-md-8">
                        {this.props.children}
                    </div>
                    {this.props.hasCloseButton && <button className="close" onClick={this.modalClose.bind(this)}></button>}
                </div>
            </section>
        );
    }
}
