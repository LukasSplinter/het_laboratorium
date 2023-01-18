import React from 'react';
import textData from "../data/data.json";

import * as DATABASE from "../Database";
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


// import "../styles/xx.scss";
import "../styles/TextPanel.scss";

import { TextItem } from "./TextItem";
import {LoadingIcon} from "./LoadingIcon";
import {TextCreate} from "./TextCreate";

export class TextPanel extends React.Component {
    constructor(props) {
        super(props);
        this.path = this.props.path;
        this.scroller = scroll.scroller;
        this.state = {
            textItems: [],
            loading: true,
            fetchFailure: false,
        };
    }

    componentDidMount() {
        this.fetchText();
    }


    async fetchText(scrollToElem = null) {
        try {
            let response = await DATABASE.getData("text/" + this.props.path.toString());
            let data = Object.values(response);

            let textElements = data
                .sort((a,b)=>{return parseInt(a.order) - parseInt(b.order)})
                .map((item, index) => {
                let id = Object.keys(response)[index];
                return <TextItem key={id} text={item.order + "\t-\t" +item.text} />
                // return <p>{item.order} + "\t-\t" + {item.text}
            });

            this.setState({textItems: textElements});

            if (scrollToElem !== null) {
                scroller.scrollTo(scrollToElem, {
                    duration: 200
                });
            }

        } catch (err) {
            this.setState({fetchFailure: false});
            console.error(err)
        }
    }

    render() {
        return (
            <section className={"textPanel"}>
                <h3 className="title">{this.props.title}</h3>

                <div className="textCreate">
                    <TextCreate refreshTextHook={this.fetchText.bind(this)} path={this.props.path.toString()} />
                </div>

                <div className="textItems">
                    {this.state.textItems.length > 0
                        ? this.state.textItems
                        : this.state.loading
                            ? <LoadingIcon />
                            : <p>{textData.adminscreen.text_empty}</p>
                    }
                </div>

            {/*    add text section*/}
            </section>
        );
    }
}
