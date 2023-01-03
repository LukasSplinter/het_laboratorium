import React from 'react';

// import "../styles/xx.scss";
import "../styles/loadingIcon.scss";

export class LoadingIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {

        return (
            <div className={"loadingIcon " + this.props.size}>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        );
    }
}
