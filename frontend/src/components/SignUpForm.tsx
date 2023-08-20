import React, {FormEvent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {UserWithoutPassword} from "../model/DataModels.ts";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ToastifyContainer from "./ToastifyContainer.tsx";
import axios from "axios";


type Props = {
    onSignUp: (username: string, password: string) => void,
    onLogout: () => void,
    user: UserWithoutPassword
}
export default function SignUpForm(props: Props) {
    const navigate = useNavigate();
    const [signUpData, setSignUpData] = useState({
        username: "",
        password: "",
        password2: ""
    });
    const [validationMessage, setValidationMessage] = useState({
        uInput: "Can't be blank",
        pInput: "Should be a minimum of 8 characters in length and must contain at least one uppercase letter, one lowercase letter and one number",
        p2Input: "Should be the same as above."
    });

    async function checkUsername(user:{name: string}):Promise<boolean> {
        return axios.post("/api/user/checkusername", user)
            .then(response => {
                return response.data;
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    function onSignUp(event: FormEvent) {
        event.preventDefault();
        if (Object.values(validationMessage).every(message => {
            return message === ""
        })) {
            const user = {name: signUpData.username};
            checkUsername(user)
                .then(result => {
                    if (result) {
                        toast.warn(("The username \"" + user.name + "\" is already taken! Please choose another one."));
                    } else {
                        props.onSignUp(signUpData.username, signUpData.password);
                        navigate("/");
                    }
                });

        } else {
            toast.warn("Some data entry are not valid!");
        }
    }

    function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        setSignUpData(prevState => ({...prevState, [event.target.id]: event.target.value}))
        validate(event.target.id, event.target.value);
    }

    function validate(name: string, value: string) {
        const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

        switch (name) {
            case "username": {
                if (value && value.length > 0) {
                    setValidationMessage(prevState => ({...prevState, uInput: ""}));
                } else {
                    setValidationMessage({
                        ...validationMessage,
                        uInput: "Can't be blank"
                    });
                }
                break;
            }
            case "password": {
                if (passwordRegEx.test(value)) {
                    setValidationMessage(prevState => ({...prevState, pInput: ""}));
                } else {
                    setValidationMessage({
                        ...validationMessage,
                        pInput: "Should be a minimum of 8 characters in length and must contain at least one uppercase letter, one lowercase letter and one number."
                    });
                }
                break;
            }
            case "password2": {
                if (value === signUpData.password) {
                    setValidationMessage(prevState => ({...prevState, p2Input: ""}));
                } else {
                    setValidationMessage({
                        ...validationMessage,
                        p2Input: "Should be the same as above."
                    });
                }
                break;
            }

        }
    }


    return (
        <div>
            <div className={"app-title"}>
                <div></div>
                <Link to={"/"}><img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/></Link>
                <div>
                    {(props.user && props.user.username !== "anonymousUser") ? props.user?.username : ""}
                    <br/>
                    {(props.user && props.user.username !== "anonymousUser") ?
                        <button onClick={props.onLogout}>logout</button> : ""}
                </div>
            </div>
            <div className={"sign-up-div"}>
                <form onSubmit={onSignUp}>
                    <p id={"login-title"}>Login</p>
                    <input id={"username"} value={signUpData.username} onChange={handleChangeInput}
                           placeholder={"username"}/>
                    <div className={"validation-message"}>{validationMessage.uInput}</div>
                    <br/>
                    <input id={"password"} value={signUpData.password} onChange={handleChangeInput}
                           placeholder={"password"}
                           type={"password"}/>
                    <div className={"validation-message"}>{validationMessage.pInput}</div>
                    <br/>
                    <input id={"password2"} value={signUpData.password2} onChange={handleChangeInput}
                           placeholder={"confirm password"}
                           type={"password"}/>
                    <div className={"validation-message"}>{validationMessage.p2Input}</div>
                    <br/>
                    <button>sign up</button>
                    <br/>
                    <br/>
                    <br/>
                    <p>Already signed up? <Link to={"/login"}>Login</Link> to use myLoans!</p>
                </form>
            </div>
            <ToastifyContainer/>
        </div>
    )
}
