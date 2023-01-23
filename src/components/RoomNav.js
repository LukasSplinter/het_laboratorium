import React from 'react';
import textData from "../data/data.json";
import * as Scroll from 'react-scroll';


import * as DATABASE from "../Database";

import { Modal } from "./Modal";

import "../styles/roomNav.scss";

export class RoomNav extends React.Component {
    constructor(props) {
        super(props);
        this.joinClassname = React.createRef();
        this.joinSchoolname = React.createRef();
        this.state = {
            joinType: null,
        };
    }

    async createRoom() {
        let className = this.joinClassname.current.value;
        let schoolName = this.joinSchoolname.current.value;

        try {
            let roomCode = await DATABASE.createRoom(className, schoolName);

            this.props.joinRoomHook(roomCode, this.joinSchoolname.current);

            Scroll.animateScroll.scrollToTop({duration: 1000, smooth: "linear"})
        } catch (err) {
            console.error(err)
        }
    }


    render() {
        return (
            <section className={"roomNav"}>
                <button className={"roomNav__button primary"} onClick={()=>{
                    this.setState({joinType: "create"});
                }}>{textData.buttons.create_room}</button>

                {this.state.joinType === "create" &&
                    <div className="input input--create">
                        <input type="text" placeholder={"schoolnaam"} ref={this.joinSchoolname}/>
                        <input type="text" placeholder={"klas"} ref={this.joinClassname}/>
                        <button className={"submit"} onClick={this.createRoom.bind(this)}></button>
                    </div>
                }
            </section>
        );
    }
}
