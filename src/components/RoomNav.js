import React from 'react';
import textData from "../data/data.json";
import * as Scroll from 'react-scroll';


import "../styles/roomNav.scss";
import {createRoom} from "../Database";

export class RoomNav extends React.Component {
    constructor(props) {
        super(props);
        this.joinClassname = React.createRef();
        this.joinSchoolname = React.createRef();
        this.state = {
            joinType: null,
            user_logged_in: this.props.user_logged_in
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props) return;

        this.setState({
            user_logged_in: this.props.user_logged_in
        })
    }

    async createRoom() {
        let className = this.joinClassname.current.value;
        let schoolName = this.joinSchoolname.current.value;

        try {
            let roomCode = await createRoom(className, schoolName);

            this.props.joinRoomHook(roomCode, this.joinSchoolname.current);
            this.joinSchoolname.current.classList.add("success");
            this.joinClassname.current.classList.add("success");

            //timeout with feedback clear
            setTimeout(()=>{
                this.joinSchoolname.current.classList.remove("success", "failure");
                this.joinSchoolname.current.value = "";
                this.joinClassname.current.classList.remove("success", "failure");
                this.joinClassname.current.value = "";

                Scroll.animateScroll.scrollToTop({duration: 1000, smooth: "linear"})
            }, 1000);
        } catch (err) {
            console.error(err)
        }
    }


    render() {
        return (
            <section className={"roomNav"}>
                <h2 className="title">{textData.buttons.create_room}</h2>
                {!this.state.user_logged_in &&
                    <span className="login-cta">{textData.homescreen.login_cta}</span>
                }
                <div className="input input--create">
                    <input type="text" placeholder={"schoolnaam"}
                           disabled={!this.state.user_logged_in}
                           ref={this.joinSchoolname}/>
                    <input type="text" placeholder={"klas"}
                           disabled={!this.state.user_logged_in}
                           ref={this.joinClassname}/>
                    <button name={"maak sessie aan"}
                            className={"submit"}
                            disabled={!this.state.user_logged_in}
                            onClick={this.createRoom.bind(this)}></button>
                </div>
            </section>
        );
    }
}
