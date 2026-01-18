import { Link } from "react-router-dom";
import "./index.css";

export default function Lab() {
    document.title = "Lab";

    return (
        <div className="lab-container">
            <div className="lab-title">
                ✨ Laboratory
            </div>
            <div className="lab-links">
                <Link to={"investment_dashboard"} className="lab-link-item">
                    <span className="lab-link-icon">📈</span>
                    <span className="lab-link-text">投资数据看板</span>
                </Link>
                <Link to={"early-payoff-calculator"} className="lab-link-item">
                    <span className="lab-link-icon">💰</span>
                    <span className="lab-link-text">提前还贷计算器</span>
                </Link>
                <Link to={"xss-attack-demo"} className="lab-link-item">
                    <span className="lab-link-icon">⚔️</span>
                    <span className="lab-link-text">XSS攻击演示</span>
                </Link>
            </div>
        </div>
    );
}
