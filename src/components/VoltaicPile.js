import React from 'react';
import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/VoltaicPile.scss";

export class VoltaicPile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            layers: [],
            score: 0
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props) return;

        this.updateLayers(this.props.score);

        this.setState({score: this.props.score});

    }

    updateLayers(score) {
        if (score === this.state.score) {
            return;
        }

        let layerElems = [];
        /*todo: optimalise: maybe only update list for differential in score instead of full refresh
        * this might work?
        * if new amount > old amount:
        *   amount to add = new - old
        *   create elements
        *   add to index, interval to add class > animate
        *   add to array with old elements
        * else:
        *   array.slice(difference)
        *
        * state.array = array
        *
        */
        console.log("old score: ", this.state.score);
        console.log("new score", score)
        for (let i = 0; i < score; i++) {
            layerElems.push(<div key={i}
                                 className={"layer " +
                                     (score > this.state.score ? "new " : "") +
                                     (this.state.score == 0 ? "first " : "")}/>)
        }
        this.setState({layers: layerElems});
    }


    render() {
        return (
            <div className="voltaicPile">
                <section className="voltaicPile__layers">
                    {this.state.layers}
                </section>
                <section className="voltaicPile__effects">
                    
                </section>
            </div>
        );
    }
}
