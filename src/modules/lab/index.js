import { useNavigate } from "react-router-dom";

export default function Lab() {
    const navigate = useNavigate();

    function onClickHandler() {
        alert("log out");
        window.localStorage.clear();
        navigate("/lab");
    }

    return (
        <div>
            <div style={{ fontSize: "45px" }}>
                Lab homepage
            </div>
            <div>
                <button onClick={onClickHandler}>Log out</button>
            </div>
        </div>
    );
}
