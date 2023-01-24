import React from 'react';
import textData from "../data/data.json";

import * as DATABASE from "../Database";

import Reorder, { reorder } from 'react-reorder';

// import "../styles/xx.scss";
import "../styles/TextPanel.scss";

import { TextItem } from "./TextItem";
import {LoadingIcon} from "./LoadingIcon";
import {TextCreate} from "./TextCreate";
import {NoContent} from "./NoContent";

export class TextPanel extends React.Component {
    constructor(props) {
        super(props);
        this.path = this.props.path;
        this.state = {
            textItems: [],
            loading: true
        };

        this.placeholder = <div className="textItem dragcontainer"><h2>Verplaats tekstelement</h2></div>
    }

    componentDidMount() {
        this.fetchText();

    }


    async fetchText() {
        try {
            let response = await DATABASE.getData("text/" + this.props.path.toString());
            let data = Object.values(response);

            let textElements = data
                .filter((item) => {
                    return item.hasOwnProperty("text");
                })
                .sort((a,b)=>{return parseInt(a.order) - parseInt(b.order)})
                .map((item, index) => {
                let id = Object.keys(response)[index];

                return <TextItem key={id}
                                 path={this.props.path}
                                 id={id}
                                 order={item.order}
                                 text={item.text}
                                 refreshTextHook={this.fetchText.bind(this, id)} />
            });

            //sorting before setting state caused rendering issues where elements got duplicated instead of rewriting
            //this workaround prevents that by resetting state list first, then only on callback it'll refresh
            this.setState({textItems: []}, ()=>{
                this.setState({textItems: textElements});
            })

        } catch (err) {
            this.setState({textItems: []});
            console.error(err)
        }
    }

    onReorder (event, previousIndex, nextIndex, fromId, toId) {
        let reorderItems = reorder(this.state.textItems, previousIndex, nextIndex);
        let newData = {};

        reorderItems = reorderItems.map((item, newIndex) => {

            //also generate new data for database update
            newData[item.key] = {order: newIndex, text: item.props.text};

            //clone element to update order prop - because prop isnt alterable when element has been defined
            return React.cloneElement(item, {
                order: newIndex
            })
        });

        //update state - this updates the local data of the text order
        this.setState({
            textItems: reorderItems
        });

        //update database - this updates the saved data of the text order
        try {
            let response = DATABASE.setData("text/" + this.props.path, newData);

        } catch (err) {
            console.error(err);
        }
    }



    render() {
        return (
            <section className={"textPanel"}>
                <h3 className="title">{this.props.title}</h3>

                <div className="textCreate">
                    <TextCreate refreshTextHook={this.fetchText.bind(this)}
                                path={this.props.path.toString()} />
                </div>


                {this.state.textItems.length > 0
                    ? <Reorder
                        className={"textItems"}
                        reorderId={"text-items-" + this.props.path}
                        placeholderClassName="drag-placeholder"
                        draggedClassName="dragged"
                        lock="horizontal"
                        touchHoldTime={250}
                        mouseHoldTime={150}
                        onReorder={this.onReorder.bind(this)}
                        placeholder={this.placeholder}>

                        {
                            this.state.textItems.map((item) => {
                                return <li className={"dragcontainer"} key={item.key}>
                                    {item}
                                </li>
                            })
                        }
                    </Reorder>
                    : <NoContent text={textData.adminscreen.text_empty} />
                }


            </section>
        );
    }
}
