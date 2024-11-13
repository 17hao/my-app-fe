import { Link, useNavigate } from "react-router-dom";

export default function Lab() {
    document.title = "Lab";

    const navigate = useNavigate();

    function onClickHandler() {
        alert("log out");
        window.localStorage.clear();
        navigate("/lab");
    }

    return (
        <div>
            <div style={{ fontSize: "30px" }}>
                🛠 工具集
            </div>
            <div>
                <a>💰</a>
                <Link to={"early-payoff-calculator"}>提前还贷计算器</Link>
            </div>
            <div>
                <button onClick={onClickHandler}>Log out</button>
            </div>
        </div>
    );
}
