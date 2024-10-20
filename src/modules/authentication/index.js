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

        var xhr = new XMLHttpRequest();

        xhr.open("POST", "http://localhost:9998/account/verify", true);

        xhr.responseType = "json";
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }

            if (xhr.status !== 200) {
                alert("Network error");
                return;
            }

            const respBody = xhr.response;

            console.log(respBody);

            if (respBody.code !== "0") {
                alert(`Log in failed. Error message: ${respBody.message}`);
                return;
            }

            if (respBody.data === "true") {
                window.localStorage.setItem("isAuth", true);
                navigate(location.state.from);
                return;
            } else {
                alert("Password is wrong.")
            }
        };

        const requestBody = {
            "name": username,
            "password": password,
        };
        xhr.send(JSON.stringify(requestBody));
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
