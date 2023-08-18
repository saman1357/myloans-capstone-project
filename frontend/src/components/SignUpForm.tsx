import React, {FormEvent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {UserWithoutPassword} from "../model/DataModels.ts";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


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
        usernameInput: "Can't be blank",
        passwordInput: "Should be a minimum of 8 characters in length and must contain at least one uppercase letter, one lowercase letter and one number",
        password2Input: "Should be the same as above."
    });


    function onSignUp(event: FormEvent) {
        event.preventDefault();
        if (Object.values(validationMessage).every(message => {return message === ""})) {
            props.onSignUp(signUpData.username, signUpData.password);
            navigate("/");
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
            case "usernameInput": {
                if (value && value.length > 0) {
                    setValidationMessage(prevState => ({...prevState, usernameInput: ""}));
                } else {
                    setValidationMessage({
                        ...validationMessage,
                        usernameInput: "Can't be blank"
                    });
                }
                break;
            }
            case "passwordInput": {
                if (passwordRegEx.test(value)) {
                    setValidationMessage(prevState => ({...prevState, passwordInput: ""}));
                } else {
                    setValidationMessage({
                        ...validationMessage,
                        passwordInput: "Should be a minimum of 8 characters in length and must contain at least one uppercase letter, one lowercase letter and one number."
                    });
                }
                break;
            }
            case "password2Input": {
                if (value === signUpData.password) {
                    setValidationMessage(prevState => ({...prevState, password2Input: ""}));
                } else {
                    setValidationMessage({
                        ...validationMessage,
                        password2Input: "Should be the same as above."
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
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div>
                    {(props.user && props.user.username !== "anonymousUser") ? props.user?.username : ""}
                    <br/>
                    {(props.user && props.user.username !== "anonymousUser") ?
                        <button onClick={props.onLogout}>logout</button> : ""}
                </div>
            </div>
            <div className={"login-div"}>
                <form onSubmit={onSignUp}>
                    <p id={"login-title"}>Login</p>
                    <input id={"usernameInput"} value={signUpData.username} onChange={handleChangeInput}
                           placeholder={"username"}/>
                    <div className={"validation-message"}>{validationMessage.usernameInput}</div>
                    <br/>
                    <input id={"passwordInput"} value={signUpData.password} onChange={handleChangeInput}
                           placeholder={"password"}
                           type={"password"}/>
                    <div className={"validation-message"}>{validationMessage.passwordInput}</div>
                    <br/>
                    <input id={"password2Input"} value={signUpData.password2} onChange={handleChangeInput}
                           placeholder={"confirm password"}
                           type={"password"}/>
                    <div className={"validation-message"}>{validationMessage.password2Input}</div>
                    <br/>
                    <button>sign up</button>
                    <br/>
                    <br/>
                    <br/>
                    <p>Already signed up? <Link to={"/login"}>Login</Link> to use myLoans!</p>
                </form>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
