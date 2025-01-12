import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "modules/account/LogIn.css";

export default function Login() {
    document.title = "Login";

    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const location = useLocation();

    async function submitHandler(event) {
        event.preventDefault();

        if (accountName === "" || password === "") {
            alert("accountName or password is empty")
            return;
        }

        let path = "/account/verify-v2";
        let url = "";
        if (process.env.REACT_APP_ENV === "prod") {
            url = "https://api.shiqihao.xyz" + path;
        } else {
            url = "/api" + path;
        }

        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": accountName,
                    "password": password,
                })
            }
        );
        if (!response.ok) {
            alert(`Response status=${response.status}`);
            return;
        }

        const respBody = await response.json();
        console.log(respBody);
        if (respBody.code !== "0" && respBody.message !== "ok") {
            alert(`Log in failed. Error message: ${respBody.message}`);
            return;
        }
        window.localStorage.setItem("session_token", respBody.data);
        if (location.state === null) {
            navigate("/lab");
        } else {
            navigate(location.state.from);
        }
    };

    return (
        <div id="login">
            <h1>Log in to Lab</h1>
            <form id="loginForm" onSubmit={submitHandler}>
                <label>Username</label>
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)}></input>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button id="loginButton">Submit</button>
            </form>
        </div>
    );
}
