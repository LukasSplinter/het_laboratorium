import React from 'react';
import textData from "../data/data.json";

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/screen.scss";
import { Title } from './Title';
import { Tabs } from './Tabs';
import { RoomAdmin } from "./RoomAdmin";
import { PuzzleAdmin } from "./PuzzleAdmin";
import { PuzzleCreate } from "./PuzzleCreate";
import {TextPanel} from "./TextPanel";

export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.roomList = [];
        this.state = {
            roomcode: this.props.roomcode,
            rooms: [],
            puzzles: []
        };
    }

    componentDidMount(){
        this.fetchRooms();
        this.fetchPuzzles();
    }

    async fetchRooms() {
        try {
            let response = await DATABASE.getRooms();
            let roomData = Object.values(response);

            let roomList = roomData.map((item, index) => {
                let roomKey = Object.keys(response)[index];
                return <RoomAdmin
                    key={roomKey}
                    roomKey={roomKey}
                    data={item}
                    refreshRoomsHook={this.fetchRooms.bind(this)}
                />
            });
            this.setState({rooms: roomList})
        } catch (err) {
            console.error(err)
        }
    }

    async fetchPuzzles() {
        try {
            let response = await DATABASE.getData("puzzles");
            let puzzleData = Object.values(response);

            let puzzleList = puzzleData.map((item, index) => {
                let puzzleID = Object.keys(response)[index];

                return <PuzzleAdmin
                    key={puzzleID}
                    data={item}
                    puzzleID={puzzleID}
                    refreshPuzzlesHook={this.fetchPuzzles.bind(this)}
                />
            });

            this.setState({puzzles: puzzleList});

        } catch (err) {
            console.error(err);
        }
    }

    render() {
        return (
            <section className="Admin screen">
                <Title />

                <div className="textsection row">
                    <p className="paragraph col-12 col-lg-6">{textData.adminscreen.explanation}</p>
                </div>

                <Tabs tabTitles={['opdrachten', 'sessies', 'tekst', 'algemeen']}>
                    <div className={"edit edit--puzzles"}>
                        <PuzzleCreate
                            refreshPuzzlesHook={this.fetchPuzzles.bind(this)}
                        />

                        {this.state.puzzles.length > 0
                            ? this.state.puzzles
                            : <div>
                                <p>{textData.adminscreen.puzzles_empty}</p>
                            </div>
                        }
                    </div>
                    <div className={"edit edit--rooms"}>
                        {this.state.rooms.length > 0
                            ? this.state.rooms
                            : <div>
                                <p>{textData.adminscreen.rooms_empty}</p>
                            </div>
                        }
                    </div>
                    <div className={"edit edit--text"}>
                        <TextPanel title={textData.adminscreen.start_introduction_title} path={"introduction"}/>
                        <TextPanel title={textData.adminscreen.start_lesson_title} path={"startLesson"}/>
                        <TextPanel title={textData.adminscreen.end_lesson_title} path={"endLesson"}/>
                    </div>
                    <div className="edit edit--settings">
                        <h2>todo: tijd aanpassen setting</h2>
                    </div>
                </Tabs>
            </section>
        );
    }
}
