import {FormEvent, useState} from "react";
type Props={
    onLogin: (username: string, password: string)=>void;
}
export default function LoginForm(props: Props){
    const [username, setUsername]=useState<string>("");
    const [password, setPassword]=useState<string>("");

    function onLogin(event:FormEvent){
        event.preventDefault();
        props.onLogin(username, password)
    }

    return(
        <form onSubmit={onLogin}>
            <p>Login</p>
            <input value={username} onChange={event=>setUsername(event.target.value)} placeholder={"username"}/>
            <input value={password} onChange={event=>setPassword(event.target.value)} placeholder={"password"} type={"password"}/>
            <button>Login</button>
        </form>
    )
}