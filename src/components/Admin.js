import React from 'react';

import * as DATABASE from "../Database";

// import "../styles/xx.scss";
import "../styles/screen.scss";
import { Title } from './Title';
import { Tabs } from './Tabs';
import { RoomControl } from "./roomControl";

export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.roomList = [];
        this.state = {
            roomcode: this.props.roomcode,
            rooms: []
        };
    }

    componentDidMount(){
        this.fetchRooms();
    }


    async fetchRooms() {
        try {
            let response = await DATABASE.getRooms();
            let roomData = Object.values(response);

            let roomList = roomData.map((item, index) => {
                let roomKey = Object.keys(response)[index];
                return <RoomControl
                    key={roomKey}
                    roomKey={roomKey}
                    name={item.name}
                    school={item.school}
                    score={item.score}
                    date={"0"}
                />
            });
            this.setState({rooms: roomList})
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <section className="Admin screen">
                <Title />

                <h1 className="title">aanpassen</h1>
                <Tabs tabTitles={['opdrachten', 'sessies', 'tekst']}>
                    <div className={"edit edit--puzzles"}>
                    </div>
                    <div className={"edit edit--rooms"}>
                        {this.state.rooms}
                    </div>
                    <div className={"edit edit--text"}></div>
                </Tabs>
            </section>
        );
    }
}
