import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// chilren is a component
// https://stackoverflow.com/q/48458334
export default function RequireAuth({ chilren }) {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        (async () => {
            // const url = "http://localhost:9000/account/auth";
            const url = "/account/auth";
            const response = await fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                    },
                    body: JSON.stringify()
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

    const location = useLocation();

    if (isAuth === null) {
        return <div>Loading...</div>; // 加载中
    }

    console.log(`isAuth=${isAuth}`);

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return chilren;
};
