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
                🛠 Here are some excellent tools
            </div>
            <div>
                <Link to={"early-payoff-calculator"}>💰 Loan Early Payoff Calculator</Link>
            </div>
            <div>
                <button onClick={onClickHandler}>Log out</button>
            </div>
        </div>
    );
}
