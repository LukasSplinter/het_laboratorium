import React from 'react';
import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/VoltaicPile.scss";

export class VoltaicPile extends React.Component {
    constructor(props) {
        super(props);
        this.layers = ["copper", "foil", "zinc"];
        this.state = {
            layers: [],
            score: 0
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props) return;

        let newScore = parseInt(this.props.score);

        this.updateLayers(newScore);
        this.setState({score: newScore});

    }

    updateLayers(score) {
        if (score === this.state.score) {
            return;
        }

        let layerElems = [];
        for (let i = 0; i < score; i++) {
            let layer = <div key={i}
                             //add .layer class, layer types and .new class if its a newly added layer
                             className={"layer " + this.layers[i % 3] + " " +
                                 (i > this.state.score - 1 ? "new " : "")}
                             //this styling is to handle animation-delays with newly added layers
                             style={{
                                 animationDelay: (i > this.state.score - 1 ? 150 * (i - this.state.score) : 0) + "ms",
                                 opacity: (i > this.state.score - 1 ? "0" : "1")}}/>
            layerElems.push(layer);
        }
        this.setState({layers: layerElems});

        //return last layer to parent
        this.props.getLastLayerHook(this.layers[(layerElems.length - 1) % 3]);
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
