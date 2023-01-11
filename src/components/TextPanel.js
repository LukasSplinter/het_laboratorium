import React from 'react';
import textData from "../data/data.json";

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/TextPanel.scss";

import { TextItem } from "./TextItem";
import {LoadingIcon} from "./LoadingIcon";

export class TextPanel extends React.Component {
    constructor(props) {
        super(props);
        this.path = this.props.path;
        this.state = {
            textItems: [],
            loading: true,
            fetchFailure: false,
        };
    }

    componentDidMount() {
        this.fetchText();
    }


    async fetchText() {
        try {
            let response = await DATABASE.getData("text/" + this.props.path.toString());
            let data = Object.values(response);
            data.sort((a, b) => {
                return a.order - b.order
            });

            let textElements = data.map((item, index) => {
                return <TextItem
                    key={Object.keys(response)[index]}
                    id={Object.keys(response)[index]}
                    order={item.order}
                    text={item.text}
                    path={this.props.path.toString()}
                    refreshTextHook={this.fetchText.bind(this)}
                />
            })

            this.setState({textItems: textElements})

        } catch (err) {
            this.setState({fetchFailure: false});
            console.error(err)
        }
    }

    render() {
        return (
            <section className={"textPanel"}>
                <h3 className="title">{this.props.title}</h3>

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
