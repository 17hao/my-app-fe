import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "modules/authentication/index.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const location = useLocation();

    console.log(location);

    async function submitHandler(event) {
        event.preventDefault();

        if (username === "" || password === "") {
            alert("username or password is empty")
            return;
        }

        console.log(username, password);

        window.localStorage.setItem("isAuth", true);
        navigate(location.state.from);
        return;

        // todo implement backend
        await fetch("http://localhost:9999/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                "userName": username,
                "password": password,
            }
        }).then(response => {
            if (response.status !== 200) {
                alert(`login failed, error msg: ${response.body}`);
            } else {
                console.log(response.body);
            }
        }).catch(errors => {
            console.log(errors);
            alert(`login failed, error msg: ${errors}`)
            return;
        });
    }

    return (
        <div id="login">
            <h1>Login to Lab</h1>
            <form id="loginForm" onSubmit={submitHandler}>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button id="loginButton">Submit</button>
            </form>
        </div>
    );
}
