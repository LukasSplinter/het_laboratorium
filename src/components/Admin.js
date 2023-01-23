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
import { TextPanel } from "./TextPanel";
import { SettingAdmin } from "./SettingAdmin";
import { LoadingIcon } from "./LoadingIcon";
import { NoContent } from "./NoContent";


export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomcode: this.props.roomcode,
            rooms: [],
            puzzles: [],
            settings: [],
            text: []
        };
    }


    // googleSignIn = async (response) => {
    //     try {
    //          const { id_token } = response;
    //          const provider = new firebase.auth.GoogleAuthProvider();
    //          provider.setCustomParameters({ id_token });
    //
    //          const { user } = await firebase.auth().signInWithPopup(provider);
    //         console.log("user:", user);
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }


    componentDidMount(){
        this.fetchRooms();
        this.fetchPuzzles();
        this.fetchSettings();
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
            this.setState({rooms: []})
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
            this.setState({puzzles: []});
            console.error(err);
        }
    }

    async fetchSettings() {
        try {
            let response = await DATABASE.getData("settings");
            let settingNames = Object.keys(response);

            let settings = settingNames.map((item, index) => {
                return <SettingAdmin
                    key={item}
                    id={item}
                    data={{name: response[item].name, value: response[item].value}}/>
            });

            this.setState({settings: settings});
        } catch (err) {
            this.setState({settings: []});
            console.error(err)
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
                            : <NoContent text={textData.adminscreen.puzzles_empty} />
                        }
                    </div>
                    <div className={"edit edit--rooms"}>
                        {this.state.rooms.length > 0
                            ? this.state.rooms
                            : <NoContent text={textData.adminscreen.rooms_empty} />
                        }
                    </div>
                    <div className={"edit edit--text"}>
                        <TextPanel title={textData.adminscreen.start_introduction_title} path={"introduction"}/>
                        <TextPanel title={textData.adminscreen.start_lesson_title} path={"startLesson"}/>
                        <TextPanel title={textData.adminscreen.end_lesson_title} path={"endLesson"}/>
                    </div>
                    <div className="edit edit--settings">
                        {this.state.settings.length > 0
                            ? this.state.settings
                            : <LoadingIcon />
                        }
                    </div>
                </Tabs>
            </section>
        );
    }
}
