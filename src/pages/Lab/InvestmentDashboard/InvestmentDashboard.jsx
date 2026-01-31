import { useNavigate } from "react-router-dom";
import CostDistribution from "./CostDistribution";
import "./InvestmentDashboad.css";

export default function InvestmentDashboard() {
    const navigate = useNavigate();

    return (
        <div className="investment-dashboard-page">
            {/* 使用 CostDistribution 组件显示投资成本分布 */}
            <CostDistribution />
            
            {/* 底部操作按钮区域 */}
            <div className="dashboard-action-panel">
                <button
                    className="action-panel-button"
                    onClick={() => navigate('/lab/investment-dashboard/operation-list')}
                >
                    <span className="action-button-icon">📊</span>
                    <span className="action-button-text">查看投资操作流水</span>
                    <span className="action-button-arrow">→</span>
                </button>
            </div>
        </div>
    );
}
