import {FormEvent, useState} from "react";
import {Link} from "react-router-dom";

type Props = {
    onLogin: (username: string, password: string) => void,
}

export default function LoginForm(props: Props) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    function onLogin(event: FormEvent) {
        event.preventDefault();
        props.onLogin(username, password)
    }

    return (
        <div>
            <div className={"app-title"}>
                <div></div>
                <img src={"/myLoans.png"} alt={"myLoans Logo"} width={"100"}/>
                <div></div>
            </div>
            <div className={"login-div"}>
                <form onSubmit={onLogin}>
                    <p id={"login-title"}>Login</p>
                    <input id={"username-input"} value={username} onChange={event => setUsername(event.target.value)}
                           placeholder={"username"}/>
                    <br/>
                    <input id={"password-input"} value={password} onChange={event => setPassword(event.target.value)} placeholder={"password"}
                           type={"password"}/>
                    <br/>
                    <button>Login</button>
                    <br/>
                    <br/>
                    <br/>
                    <p>Still not registered? <Link to={"/sign-up"}>Sign up</Link> to use myLoans!</p>
                </form>
            </div>
        </div>
    )
}
