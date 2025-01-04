import { Link, useNavigate } from "react-router-dom";

export default function Lab() {
    document.title = "Lab";

    const navigate = useNavigate();

    function onClickHandler() {
        window.localStorage.clear();
        navigate("/lab");
    }

    return (
        <div style={{ marginLeft: "30%" }}>
            <div style={{ margin: "10px", fontSize: "30px" }}>
                🏭 Laboratory
            </div>
            <div style={{ margin: "10px" }}>
                <b>💰 </b>
                <Link to={"early-payoff-calculator"}>提前还贷计算器</Link>
            </div>
            <div style={{ margin: "10px" }}>
                <b>⚔️ </b>
                <Link to={"xss-attack-demo"}>XSS攻击演示</Link>
            </div>
            <div>
                <button onClick={onClickHandler}>Log out</button>
            </div>
        </div>
    );
}
