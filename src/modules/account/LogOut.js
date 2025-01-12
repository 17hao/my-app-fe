import { useNavigate } from "react-router-dom";

export default function LogOut() {
    const navigate = useNavigate();

    function onClickHandler() {
        window.localStorage.clear();
        navigate("/login");
    }

    return (
        <div>
            <button onClick={onClickHandler}>Log out</button>
        </div>
    );
}
