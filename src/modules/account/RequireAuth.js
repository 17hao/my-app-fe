import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// chilren is a component
// https://stackoverflow.com/q/48458334
export default function RequireAuth({ chilren }) {
    const [isAuth, setIsAuth] = useState(null);

    const location = useLocation();

    useEffect(() => {
        (async () => {
            const token = window.localStorage.getItem("session_token");
            if (token === null) {
                setIsAuth(false);
                return;
            }

            let path = "/account/auth-v2";
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
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ "token": token })
                }
            );
            if (!response.ok) {
                alert(`Response status=${response.status}`);
            }
            const respBody = await response.json();
            if (respBody.code !== "0" && respBody.message !== "ok") {
                console.log(`Auth failed. Error message: ${respBody.message}`);
            }
            console.log(respBody);
            setIsAuth(respBody.data);
        })();
    }, []);

    if (isAuth === null) {
        return <div>Loading...</div>; // 加载中
    }

    console.log(`isAuth=${isAuth}`);

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return chilren;
};
