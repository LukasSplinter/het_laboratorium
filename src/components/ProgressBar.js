import React from "react";

// import "../styles/xx.scss";
import "../styles/ProgressBar.scss";


export class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.progressBar = React.createRef();
        this.duration = this.props.duration;
        this.stepSize = 100 / this.duration;
        this.state = {
            time: 0,
        };
    }

    componentDidMount(){
        if (this.props.start) {
            this.stopTimer();
            this.startTimer();
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props) return;

        this.duration = this.props.duration;
        this.stepSize = 100 / this.duration;

        if (this.props.start) {
            this.stopTimer();
            this.startTimer();
        }
    }


    startTimer() {
        this.interval = setInterval(()=> {
            let currentTime = this.state.time;
            this.setState({time: currentTime + 1});
            this.updateProgressBar();

            if (currentTime == this.duration) {
                this.stopTimer();
                if (this.props.endHook !== undefined ) this.props.endHook();
            }
        }, 1000);
    }
    stopTimer() {
        clearInterval(this.interval);
    }


    updateProgressBar() {
        let newWidth = (this.state.time * this.stepSize) + "%";
        this.progressBar.current.animate(
            [ {width: newWidth} ],
            {duration: 1000, fill: "forwards"});
    }


    render() {
        return (
            <div className="progressBar">
                <div className="progressBar__bar" ref={this.progressBar}></div>
            </div>

        );
    }
}
