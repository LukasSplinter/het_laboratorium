import React from 'react';

import * as DATABASE from "../Database";

import { Modal } from "./Modal";

import "../styles/roomNav.scss";

export class RoomNav extends React.Component {
    constructor(props) {
        super(props);
        this.joinRoom = React.createRef();
        this.joinClassname = React.createRef();
        this.joinSchoolname = React.createRef();
        this.state = {
            joinType: null,
        };
    }


    render() {
        return (
            <section className={"roomNav"}>
                <button className={"roomNav__button primary"} onClick={()=>{
                    this.setState({joinType: "create"});
                }}>Kamer aanmaken</button>
                <button className={"roomNav__button secondary"} onClick={()=>{
                    this.setState({joinType: "join"});
                }}>Code invoeren</button>

                {this.state.joinType === "create" &&
                    <div className="input input--create">
                        <input type="text" placeholder={"schoolnaam"} ref={this.joinSchoolname}/>
                        <input type="text" placeholder={"klas"} ref={this.joinClassname}/>
                        <button className={"submit"} onClick={()=> {
                            this.props.createRoomHook(this.joinClassname.current.value, this.joinSchoolname.current.value)
                        }}></button>
                    </div>
                }
                {this.state.joinType === "join" &&
                    <div className="input input--join">
                        <input className={""} type="text" placeholder={"kamercode"} ref={this.joinRoom}/>
                        <button className={"submit"} onClick={async () => {
                            this.props.joinRoomHook(this.joinInput.current.value, this.joinInput.current);
                        }}></button>
                    </div>
                }
            </section>
        );
    }
}
