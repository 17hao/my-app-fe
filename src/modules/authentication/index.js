import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "modules/authentication/index.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const location = useLocation();

    // console.log(location);

    async function submitHandler(event) {
        event.preventDefault();

        if (username === "" || password === "") {
            alert("username or password is empty")
            return;
        }

        // console.log(username, password);

        await fetch("http://localhost:9998/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000"
            },
            body: JSON.stringify({
                "name": username,
                "password": password,
            })
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);

                if (data.code !== "0") {
                    alert("login failed")
                    return;
                }

                if (data.data === "true") {
                    window.localStorage.setItem("isAuth", true);
                    navigate(location.state.from);
                    return;
                } else {
                    alert("login failed")
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
