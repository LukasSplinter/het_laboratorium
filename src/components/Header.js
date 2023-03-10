import React from 'react';
import textData from "../data/data.json";
import { signInWithGoogle, userSignOut, getData, auth} from "../Database";

import "../styles/Header.scss";

import iconLogin from "../assets/icon-login.svg";
import iconLogout from "../assets/icon-logout.svg";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.roomInput = React.createRef();
        this.state = {
            roomcode: (this.props.roomcode ? this.props.roomcode : ""),
            user_logged_in: this.props.user_logged_in,
            navOpen: false,
            modalOpen: this.props.activeWindow === "home" && !this.props.roomcode ? true : false,
            activeWindow: this.props.activeWindow,
            codeInput: null,
            school: "",
            classname: ""
        };
    }

    componentDidMount() {
        if (this.state.roomcode !== "") this.fetchSchoolData();

        this.fetchLoginData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps === this.props) return;

        this.setState({
            roomcode: this.props.roomcode,
            user_logged_in: this.props.user_logged_in
        })
    }


    async login() {
        try {
            let response = await signInWithGoogle();
            this.props.loginHook(response)
        } catch(err) {
            this.props.logoutHook();
            console.error(err);
        }
    }


    async logout() {
        try {
            let response = await userSignOut();
            this.props.logoutHook();
        } catch(err) {
            console.error(err);
        }
    }


    async fetchLoginData() {
        let authState = auth.onAuthStateChanged(user => {
            //user already logged in
            if (user) {
                this.props.loginHook(user);
            }
        })
    }

    async fetchSchoolData() {
        try {
            let response = await getData("rooms/" + this.state.roomcode);

            this.setState({
                school: response.school,
                classname: response.name
            });
        } catch (err) {
            console.error(err)
        }
    }

    toggleNav() {
        let currentState = this.state.navOpen;
        this.setState({navOpen: !currentState});
    }

    toggleRoomPopup() {
        this.setState({modalOpen: !this.state.modalOpen});
    }

    render() {
        return (
            <header className="header row">
                <div className="header__bar col-12">
                    <button name={"open navigatie"} className={"header__bar__navigation " + (this.state.navOpen ? "close" : "")} onClick={this.toggleNav.bind(this)}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </button>
                    <div className="header__bar__roomcode">
                        <p className={"information"}>
                            <span className={"information__school"}>{this.state.school}</span>
                            <span className={"information__class"}>{this.state.classname}</span>
                        </p>
                        <button name={"vul sessiecode in"} className="button" onClick={this.toggleRoomPopup.bind(this)}>
                            <h3>{this.state.roomcode !== "" ? this.state.roomcode : "xxxxx"}</h3>
                        </button>

                        <div className="login">
                            {this.state.user_logged_in
                                ? <img className={"photo"} src={this.props.user.photoURL} referrerPolicy="no-referrer" alt="gebruiker foto"/>
                                : <p className="text">{this.state.user_logged_in ? "log uit" : "log in"}</p>
                            }
                            {this.state.user_logged_in
                                ? <button name={"log account uit"}
                                          className="login__button login__button--logout"
                                          title={"log uit"}
                                          onClick={this.logout.bind(this)}>
                                    <img className={"icon"} src={iconLogout} alt="log uit icoon"/>
                                </button>
                                :<button name={"log in"}
                                         className="login__button login__button--login"
                                         title={"log in"}
                                         onClick={this.login.bind(this)}>
                                    <img className={"icon"} src={iconLogin} alt="log in icoon"/>
                                </button>
                            }
                        </div>

                        {this.state.modalOpen &&
                            <div className="roomcode__tooltip">
                                <input type="text" placeholder={"sessiecode"} className={"input"} ref={this.roomInput}/>
                                <button name={"ga naar sessienummer"} className="button confirm" onClick={()=>{
                                    this.props.switchRoomHook(this.roomInput.current.value, this.roomInput.current);
                                }}>ga</button>
                            </div>
                        }

                    </div>

                </div>

                {
                    (this.state.activeWindow === "teacher" || this.state.activeWindow === "admin") &&
                    (!this.state.user_logged_in) &&
                    <div className="header__login-cta col-12">
                        <p className="header__login-cta__text">
                            {textData.general.login_message}
                            <span className="link"
                                  onClick={this.login.bind(this)}>log in</span>
                        </p>
                    </div>
                }


                <div className={"nav " +
                    (this.state.navOpen ? "open " : "")}>
                    <ul className="nav__list">
                        <li className={
                            (this.state.activeWindow === "home" ? "active " : "")}
                            onClick={() => {
                            this.props.navigationHook("home");
                            this.setState({navOpen: false, activeWindow: "home"})
                        }}>
                            <h3>Beginscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "teacher" ? "active" : "" +
                            (this.state.roomcode !== "" ? "" : "noRoomCode ")}
                            onClick={() => {
                            this.props.navigationHook("teacher");
                            this.setState({navOpen: false, activeWindow: "teacher"})
                        }}>
                            <h3>Docentenscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "student" ? "active" : "" +
                            (this.state.roomcode !== "" ? "" : "noRoomCode ")}
                            onClick={() => {
                            this.props.navigationHook("student");
                            this.setState({navOpen: false, activeWindow: "student"})
                        }}>
                            <h3>Leerlingenscherm</h3>
                        </li>
                        <li className={this.state.activeWindow === "admin" ? "active" : ""}
                            onClick={() => {
                            this.props.navigationHook("admin");
                            this.setState({navOpen: false, activeWindow: "admin"})
                        }}>
                            <h3>Beheerscherm</h3>
                        </li>
                    </ul>
                </div>


            </header>
        );
    }
}
