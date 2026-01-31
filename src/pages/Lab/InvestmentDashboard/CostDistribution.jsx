import { useState, useEffect } from "react";
import { getApiUrl } from "@/config/env";
import { PLATFORM_OPTIONS, OP_ITEM_L1_TYPE_OPTIONS, OP_ITEM_L2_TYPE_OPTIONS } from "./consts";
import "./InvestmentDashboad.css";

export default function CostDistribution() {
    // 弹窗显示的一级分类及其二级分类数据
    const [modalL1Type, setModalL1Type] = useState(null);
    const [modalL2Details, setModalL2Details] = useState([]);

    // 投资成本数据（资产配置饼图）
    const [analyzeCostData, setAnalyzeCostData] = useState({
        itemCostDetails: [],
        platformCostDetails: [],
    });

    const [analyzeLoading, setAnalyzeLoading] = useState(false);
    const [analyzeError, setAnalyzeError] = useState("");

    // 调用 /investment/analyze/cost 接口，获取投资对象成本 & 投资平台成本分布
    async function fetchAnalyzeCostData() {
        let url = getApiUrl("/investment/analyze/cost");

        setAnalyzeLoading(true);
        setAnalyzeError("");

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                console.error("获取投资分析数据失败，HTTP 状态码:", response.status);
                setAnalyzeError("获取投资分析数据失败");
                return;
            }

            const respBody = await response.json();
            console.log("fetch cost response", respBody);

            // 兼容直接返回和 data 包裹两种格式
            const data = respBody.data || respBody || {};

            setAnalyzeCostData({
                itemCostDetails: Array.isArray(data.itemCostDetails)
                    ? data.itemCostDetails
                    : [],
                platformCostDetails: Array.isArray(data.platformCostDetails)
                    ? data.platformCostDetails
                    : [],
            });
        } catch (err) {
            console.error("获取投资分析数据时发生错误", err);
            setAnalyzeError("获取投资分析数据时发生错误");
        } finally {
            setAnalyzeLoading(false);
        }
    }

    useEffect(() => {
        document.title = "投资成本分布";
        fetchAnalyzeCostData();
    }, []);

    // 颜色列表：用于饼图不同扇区
    const PIE_COLORS = [
        "#4e79a7",
        "#f28e2b",
        "#e15759",
        "#76b7b2",
        "#59a14f",
        "#edc948",
        "#b07aa1",
        "#ff9da7",
        "#9c755f",
        "#bab0ab",
    ];

    // 金额格式化：统一保留两位小数
    function formatAmountTwoDecimals(value) {
        const num = Number(value);
        if (!Number.isFinite(num)) return "-";
        return num.toFixed(2);
    }

    // 百分比格式化：统一保留两位小数并带上 % 号
    function formatPercentTwoDecimals(value) {
        const num = Number(value);
        if (!Number.isFinite(num)) return "-";
        return `${num.toFixed(2)}%`;
    }

    // 根据金额字段计算饼图的 conic-gradient 样式
    function buildPieStyle(list) {
        if (!Array.isArray(list) || list.length === 0) {
            return { background: "#f0f0f0" };
        }

        const values = list.map((item) => Number(item.amount) || 0);
        const total = values.reduce((sum, v) => sum + v, 0);

        if (!total) {
            return { background: "#f0f0f0" };
        }

        let current = 0;
        const segments = [];

        for (let i = 0; i < list.length; i++) {
            const value = values[i];
            if (!value) continue;
            const start = current;
            const span = (value / total) * 100;
            const end = start + span;
            const color = PIE_COLORS[i % PIE_COLORS.length];
            segments.push(`${color} ${start}% ${end}%`);
            current = end;
        }

        if (segments.length === 0) {
            return { background: "#f0f0f0" };
        }

        return {
            backgroundImage: `conic-gradient(${segments.join(", ")})`,
        };
    }

    // 根据 l1Type code 找到中文名称
    function getL1TypeLabel(code) {
        if (!code) return "";
        return (
            OP_ITEM_L1_TYPE_OPTIONS.find((item) => item.value === code)?.label ||
            code
        );
    }

    // 根据 l1Type 和 l2Type code 找到二级分类中文名称
    function getL2TypeLabel(l1Code, l2Code) {
        if (!l2Code) return "";
        const l2List = OP_ITEM_L2_TYPE_OPTIONS[l1Code] || [];
        return (
            l2List.find((item) => item.value === l2Code)?.label || l2Code
        );
    }

    // 按一级分类聚合投资对象成本，用于子母饼图内圈
    function aggregateItemCostByL1(details) {
        if (!Array.isArray(details)) return [];
        const map = new Map();
        details.forEach((item) => {
            const l1 = item.l1Type || "";
            const amount = Number(item.amount) || 0;
            if (!l1 || !amount) return;
            map.set(l1, (map.get(l1) || 0) + amount);
        });
        return Array.from(map.entries()).map(([l1Type, amount]) => ({ l1Type, amount }));
    }

    // 根据平台 code 找到中文名称
    function getPlatformLabel(code) {
        if (!code) return "";
        return (
            PLATFORM_OPTIONS.find((item) => item.value === code)?.label || code
        );
    }

    // 处理图例点击，打开弹窗显示二级分类
    function handleLegendClick(l1Type) {
        const subDetails = (analyzeCostData.itemCostDetails || []).filter(
            (detail) => detail.l1Type === l1Type && detail.l2Type && detail.l2Type.trim() !== ""
        );
        // 只有当有有效的二级分类数据时才打开弹窗
        if (subDetails.length > 0) {
            setModalL1Type(l1Type);
            setModalL2Details(subDetails);
        }
    }

    // 关闭弹窗
    function closeModal() {
        setModalL1Type(null);
        setModalL2Details([]);
    }

    // 饼图总成本（用于展示所有金额汇总后的值）
    const itemCostTotalAmount = (analyzeCostData.itemCostDetails || []).reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );
    const platformCostTotalAmount = (analyzeCostData.platformCostDetails || []).reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    // 投资对象成本子母饼图内圈数据（一级分类聚合）
    const itemCostL1Aggregated = aggregateItemCostByL1(
        analyzeCostData.itemCostDetails || []
    ).sort((a, b) => b.amount - a.amount); // 按金额从高到低排序

    return (
        <>
            {/* 投资成本饼图：投资对象成本 & 投资平台成本 */}
            <div className="investment-dashboard-analysis-section">
                <div className="analysis-card">
                    <h2 className="analysis-title">投资对象成本分布</h2>
                    {analyzeLoading && (
                        <div className="analysis-hint">加载中...</div>
                    )}
                    {analyzeError && !analyzeLoading && (
                        <div className="analysis-error">{analyzeError}</div>
                    )}
                    {!analyzeLoading && !analyzeError && (
                        <div className="analysis-content">
                            {/* 普通饼图：按一级分类聚合 */}
                            <div className="analysis-figure">
                                <div className="analysis-total">
                                    总成本：{formatAmountTwoDecimals(itemCostTotalAmount)} cny
                                </div>
                                <div
                                    className="analysis-pie"
                                    style={buildPieStyle(itemCostL1Aggregated)}
                                />
                            </div>
                            <ul className="analysis-legend">
                                {itemCostL1Aggregated.map((item, index) => {
                                    const l1Type = item.l1Type;
                                    const l1Label = getL1TypeLabel(l1Type);
                                    const percentOfTotal = itemCostTotalAmount
                                        ? (item.amount / itemCostTotalAmount) * 100
                                        : 0;

                                    const mainColor =
                                        PIE_COLORS[index % PIE_COLORS.length];

                                    return (
                                        <li key={l1Type} className="analysis-legend-item">
                                            <div
                                                className="legend-main-row"
                                                onClick={() => handleLegendClick(l1Type)}
                                            >
                                                <span
                                                    className="legend-color-block"
                                                    style={{ backgroundColor: mainColor }}
                                                />
                                                <span className="legend-text">
                                                    {l1Label}
                                                    {"："}
                                                    {formatAmountTwoDecimals(item.amount)}
                                                    {" cny"}
                                                    {" ("}
                                                    {formatPercentTwoDecimals(percentOfTotal)}
                                                    {")"}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                                {itemCostL1Aggregated.length === 0 && (
                                    <li className="analysis-legend-empty">暂无数据</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="analysis-card">
                    <h2 className="analysis-title">投资平台成本分布</h2>
                    {analyzeLoading && (
                        <div className="analysis-hint">加载中...</div>
                    )}
                    {analyzeError && !analyzeLoading && (
                        <div className="analysis-error">{analyzeError}</div>
                    )}
                    {!analyzeLoading && !analyzeError && (
                        <div className="analysis-content">
                            <div className="analysis-figure">
                                <div className="analysis-total">
                                    总成本：{formatAmountTwoDecimals(platformCostTotalAmount)} cny
                                </div>
                                <div
                                    className="analysis-pie"
                                    style={buildPieStyle(analyzeCostData.platformCostDetails)}
                                />
                            </div>
                            <ul className="analysis-legend">
                                {analyzeCostData.platformCostDetails.map((item, index) => (
                                    <li key={index} className="analysis-legend-item">
                                        <div className="legend-main-row">
                                            <span
                                                className="legend-color-block"
                                                style={{
                                                    backgroundColor:
                                                        PIE_COLORS[index % PIE_COLORS.length],
                                                }}
                                            />
                                            <span className="legend-text">
                                                {getPlatformLabel(item.opPlatform)}
                                                {"："}
                                                {item.amount ?? "-"}
                                                {" cny"}
                                                {" ("}
                                                {typeof item.percent !== "undefined"
                                                    ? formatPercentTwoDecimals(item.percent)
                                                    : "-"}
                                                {")"}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                                {(!analyzeCostData.platformCostDetails ||
                                    analyzeCostData.platformCostDetails.length === 0) && (
                                        <li className="analysis-legend-empty">暂无数据</li>
                                    )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* 二级分类弹窗 */}
            {modalL1Type && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{getL1TypeLabel(modalL1Type)} - 二级分类详情</h3>
                            <button className="modal-close-btn" onClick={closeModal}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            {modalL2Details.length > 0 ? (
                                <ul className="modal-list">
                                    {modalL2Details.map((detail, index) => {
                                        const subColor = PIE_COLORS[index % PIE_COLORS.length];
                                        return (
                                            <li key={index} className="modal-list-item">
                                                <span
                                                    className="modal-color-block"
                                                    style={{ backgroundColor: subColor }}
                                                />
                                                <span className="modal-text">
                                                    {getL2TypeLabel(detail.l1Type, detail.l2Type) ||
                                                        detail.l2Type ||
                                                        "-"}
                                                    {"："}
                                                    {formatAmountTwoDecimals(detail.amount)}
                                                    {" cny"}
                                                    {typeof detail.percent !== "undefined" &&
                                                        detail.percent !== null
                                                        ? ` (${formatPercentTwoDecimals(detail.percent)})`
                                                        : ""}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="modal-empty">暂无二级分类数据</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
