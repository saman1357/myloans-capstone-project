import {FormEvent, useState} from "react";
import {Link} from "react-router-dom";
import {UserWithoutPassword} from "../model/DataModels.ts";

type Props = {
    onSignUp: (username: string, password: string) => void,
    onLogout: ()=>void,
    user: UserWithoutPassword
}
export default function SignUpForm(props: Props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");

    function onSignUp(event: FormEvent) {
        event.preventDefault();
        props.onSignUp(username, password)
    }

    return (
        <div>
            <div className={"app-title"}>
                <div></div>
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div>
                    {(props.user && props.user.username!=="anonymousUser")? props.user?.username : ""}
                    <br/>
                    {(props.user && props.user.username!=="anonymousUser")? <button onClick={props.onLogout}>logout</button> : ""}
                </div>
            </div>
            <div className={"login-div"}>
                <form onSubmit={onSignUp}>
                    <p id={"login-title"}>Login</p>
                    <input id={"username-input"} value={username} onChange={event => setUsername(event.target.value)}
                           placeholder={"username"}/>
                    <br/>
                    <input id={"password-input"} value={password} onChange={event => setPassword(event.target.value)} placeholder={"password"}
                           type={"password"}/>
                    <br/>
                    <input id={"password2-input"} value={password2} onChange={event => setPassword2(event.target.value)} placeholder={"confirm password"}
                           type={"password"}/>
                    <br/>
                    <button>sign up</button>
                    <br/>
                    <br/>
                    <br/>
                    <p>Already signed up? <Link to={"/login"}>Login</Link> to use myLoans!</p>
                </form>
            </div>
        </div>
    )
}
