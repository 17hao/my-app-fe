import { useState, useEffect } from "react";
import "./InvestmentDashboad.css";

// 平台：value 用于请求体，label 用于下拉展示
const PLATFORM_OPTIONS = [
    { value: "cmb", label: "招商银行" },
    { value: "chinastock", label: "银河证券" },
    { value: "pingan", label: "平安证券" },
    { value: "usmart_sg", label: "盈立证券sg" },
    { value: "za", label: "众安银行" },
    { value: "ibkr", label: "盈透证券" },
    { value: "hsbc", label: "汇丰银行" },
    { value: "schwab", label: "嘉信理财" },
];

// 操作类型
const OP_TYPE_OPTIONS = [
    { value: "buy", label: "买入" },
    { value: "sell", label: "卖出" },
];

// 一级分类：value 用英文 code，label 用中文
const OP_ITEM_L1_TYPE_OPTIONS = [
    { value: "usTreasury", label: "美国国债" },
    { value: "otherBonds", label: "其他债券" },
    { value: "usStock", label: "美股" },
    { value: "globalStock", label: "全球股市" },
    { value: "gold", label: "黄金" },
    { value: "commodity", label: "大宗商品" },
];

// 二级分类：按一级分类 code 分组，value 用于请求体，label 用于展示
const OP_ITEM_L2_TYPE_OPTIONS = {
    usTreasury: [
        { value: "shortTerm", label: "短期国债（0-1Y）" },
        { value: "intermediateTerm", label: "中期国债（1-10Y）" },
        { value: "longTerm", label: "长期国债（20Y+）" },
    ],
    otherBonds: [
        { value: "usCorporateBond", label: "美国企业债" },
        { value: "cnBalancedBond", label: "中国混合债" },
    ],
    usStock: [
        { value: "sp500", label: "标普500" },
        { value: "ndx100", label: "纳指100" },
    ],
    globalStock: [
        { value: "aShares", label: "A股" },
        { value: "hkStock", label: "港股" },
        { value: "ftse100", label: "富时100" },
        { value: "nikkei225", label: "日经225" },
        { value: "cac40", label: "法国cac40" },
        { value: "dax", label: "德国dax" },
    ],
};

export default function InvestmentDashboard() {
    const [opDate, setOpDate] = useState("");
    // 注意：这里存的是 code（value），不是展示文案
    const [opPlatform, setOpPlatform] = useState("");
    const [opType, setOpType] = useState("");

    const [opItemSymbol, setOpItemSymbol] = useState("");
    const [opItemL1Type, setOpItemL1Type] = useState("");
    const [opItemL2Type, setOpItemL2Type] = useState("");

    const [amountNumber, setAmountNumber] = useState("");
    const [amountCurrency, setAmountCurrency] = useState("cny");
    const [amountEquivalentCny, setAmountEquivalentCny] = useState("");

    const [opRecords, setOpRecords] = useState([]);

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

    // 查询完整的投资操作流水列表
    async function fetchOperations() {
        let path = "/investment/operations";
        let url = "";
        if (process.env.REACT_APP_ENV === "prod") {
            url = process.env.REACT_APP_BACKEND_HOST + path;
        } else {
            url = "/api" + path;
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                console.error("获取投资操作流水失败，HTTP 状态码:", response.status);
                return;
            }

            const respBody = await response.json();
            console.log("fetch operations response", respBody);

            if (Array.isArray(respBody)) {
                setOpRecords(respBody);
            } else if (Array.isArray(respBody.data)) {
                setOpRecords(respBody.data);
            } else {
                console.warn("响应数据格式不符合预期");
            }
        } catch (err) {
            console.error("获取投资操作流水时发生错误", err);
        }
    }

    // 调用 /investment/analyze/cost 接口，获取投资对象成本 & 投资平台成本分布
    async function fetchAnalyzeCostData() {
        let path = "/investment/analyze/cost";
        let url = "";
        if (process.env.REACT_APP_ENV === "prod") {
            url = process.env.REACT_APP_BACKEND_HOST + path;
        } else {
            url = "/api" + path;
        }

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
        document.title = "投资数据看板";
        fetchOperations();
        fetchAnalyzeCostData();
    }, []);

    async function submitHandler(event) {
        event.preventDefault();

        const opItemL2TypeOptions = OP_ITEM_L2_TYPE_OPTIONS[opItemL1Type] || [];

        if (!opDate || !opPlatform || !opType || !opItemSymbol || !opItemL1Type || !amountNumber || !amountCurrency || !amountEquivalentCny || (opItemL2TypeOptions.length > 0 && !opItemL2Type)) {
            alert("请完整填写所有字段");
            return;
        }

        const l2Value = (opItemL2TypeOptions.length === 0) ? "" : opItemL2Type;

        const body = {
            opDate: opDate,
            opPlatform: opPlatform,
            opType: opType,
            opItem: {
                symbol: opItemSymbol,
                l1Type: opItemL1Type,
                l2Type: l2Value,
            },
            opAmount: {
                number: amountNumber,
                currency: amountCurrency,
                equivalentCny: amountEquivalentCny,
            },
        };

        console.log("submit payload", body);

        let path = "/investment/operation";
        let url = "";
        if (process.env.REACT_APP_ENV === "prod") {
            url = process.env.REACT_APP_BACKEND_HOST + path;
        } else {
            url = "/api" + path;
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                alert(`请求失败，HTTP 状态码: ${response.status}`);
                return;
            }

            const respBody = await response.json();
            console.log("submit response", respBody);

            if (respBody.code !== "0" && respBody.message !== "ok") {
                alert(`提交失败：${respBody.message}`);
                return;
            }

            // 提交成功后重置表单
            setOpDate("");
            setOpPlatform("");
            setOpType("");
            setOpItemSymbol("");
            setOpItemL1Type("");
            setOpItemL2Type("");
            setAmountNumber("");
            setAmountCurrency("cny");
            setAmountEquivalentCny("");

            alert("提交成功");
            // 重新拉取完整流水记录列表 & 分析数据
            fetchOperations();
            fetchAnalyzeCostData();
        } catch (err) {
            console.error(err);
            alert("提交时发生错误，请稍后重试");
        }
    }

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

    const currentL2Options = OP_ITEM_L2_TYPE_OPTIONS[opItemL1Type] || [];

    // 按日期倒序排序（假定为 YYYY-MM-DD 格式）
    const sortedRecords = [...opRecords].sort((a, b) => {
        const da = a.opDate || "";
        const db = b.opDate || "";
        return db.localeCompare(da);
    });

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
    );

    return (
        <div className="investment-dashboard-page">
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

            {/* 表格放在表单上方 */}
            <div className="investment-dashboard-table-section">
                <h2 className="investment-dashboard-table-title">投资操作流水表</h2>
                <table className="investment-dashboard-table">
                    <thead>
                        <tr>
                            <th className="col-date">日期</th>
                            <th className="col-platform">平台</th>
                            <th className="col-op-type">操作类型</th>
                            <th className="col-op-target">操作对象</th>
                            <th className="col-amount">金额</th>
                            <th className="col-amount-cny">等值人民币金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRecords.map((item, index) => {
                            const opPlatformLabel = PLATFORM_OPTIONS.find(p => p.value === item.opPlatform)?.label || item.opPlatform;
                            const opTypeLabel = OP_TYPE_OPTIONS.find(t => t.value === item.opType)?.label || item.opType;

                            // 操作对象：既兼容字符串字段，也兼容嵌套对象
                            let objectText = "";
                            if (typeof item.opItem === "string") {
                                objectText = item.opItem;
                            } else if (item.opItem && typeof item.opItem === "object") {
                                const l1Label = OP_ITEM_L1_TYPE_OPTIONS.find(l1 => l1.value === item.opItem.l1Type)?.label || item.opItem.l1Type || "";
                                // 二级分类 label 反查
                                const allL2 = Object.values(OP_ITEM_L2_TYPE_OPTIONS).flat();
                                const l2Label = item.opItem.l2Type
                                    ? (allL2.find(l2 => l2.value === item.opItem.l2Type)?.label || item.opItem.l2Type)
                                    : "";

                                if (l2Label === "") {
                                    objectText = `代号：${item.opItem.symbol || ""} | 一级分类：${l1Label}`
                                } else {
                                    objectText = `代号：${item.opItem.symbol || ""} | 一级分类：${l1Label} | 二级分类：${l2Label}`;
                                }
                            }

                            // 金额：兼容字符串字段和嵌套对象
                            let amountText = "";
                            let amountCnyText = "";
                            if (typeof item.opAmount === "string") {
                                amountText = item.opAmount;
                            } else if (item.opAmount && typeof item.opAmount === "object") {
                                amountText = `${item.opAmount.number} ${item.opAmount.currency}`;
                                amountCnyText = item.opAmount.equivalentCny;
                            }
                            if (!amountCnyText && item.opAmountCny) {
                                amountCnyText = item.opAmountCny;
                            }

                            return (
                                <tr key={index}>
                                    <td>{item.opDate}</td>
                                    <td>{opPlatformLabel}</td>
                                    <td>{opTypeLabel}</td>
                                    <td>{objectText}</td>
                                    <td>{amountText}</td>
                                    <td>{amountCnyText}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <form
                onSubmit={submitHandler}
                className="investment-dashboard-form"
            >
                <h1 className="investment-dashboard-form-title">投资操作流水录入</h1>
                <div className="form-group">
                    <label className="form-label">日期</label>
                    <input
                        type="date"
                        value={opDate}
                        onChange={(e) => setOpDate(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">平台</label>
                    <select
                        value={opPlatform}
                        onChange={(e) => setOpPlatform(e.target.value)}
                        className="form-control"
                    >
                        <option value="">请选择平台</option>
                        {PLATFORM_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">操作类型</label>
                    <select
                        value={opType}
                        onChange={(e) => setOpType(e.target.value)}
                        className="form-control"
                    >
                        <option value="">请选择操作类型</option>
                        {OP_TYPE_OPTIONS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                <fieldset className="form-fieldset">
                    <legend className="form-legend">操作对象</legend>
                    <div className="form-group-small">
                        <label className="form-label">代号</label>
                        <input
                            type="text"
                            value={opItemSymbol}
                            onChange={(e) => setOpItemSymbol(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group-small">
                        <label className="form-label">一级分类</label>
                        <select
                            value={opItemL1Type}
                            onChange={(e) => {
                                setOpItemL1Type(e.target.value);
                                setOpItemL2Type("");
                            }}
                            className="form-control"
                        >
                            <option value="">请选择一级分类</option>
                            {OP_ITEM_L1_TYPE_OPTIONS.map((l1) => (
                                <option key={l1.value} value={l1.value}>{l1.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group-last">
                        <label className="form-label">二级分类</label>
                        <select
                            value={opItemL2Type}
                            onChange={(e) => setOpItemL2Type(e.target.value)}
                            className="form-control"
                            disabled={currentL2Options.length === 0 || !opItemL1Type}
                        >
                            <option value="">请选择二级分类</option>
                            {currentL2Options.map((l2) => (
                                <option key={l2.value} value={l2.value}>{l2.label}</option>
                            ))}
                        </select>
                    </div>
                </fieldset>

                <fieldset className="form-fieldset">
                    <legend className="form-legend">金额</legend>
                    <div className="form-group-small">
                        <label className="form-label">数值</label>
                        <input
                            type="number"
                            value={amountNumber}
                            onChange={(e) => setAmountNumber(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group-small">
                        <label className="form-label">币种</label>
                        <select
                            value={amountCurrency}
                            onChange={(e) => setAmountCurrency(e.target.value)}
                            className="form-control"
                        >
                            <option value="cny">cny</option>
                            <option value="usd">usd</option>
                            <option value="hkd">hkd</option>
                        </select>
                    </div>
                    <div className="form-group-last">
                        <label className="form-label">等值人民币金额</label>
                        <input
                            type="number"
                            value={amountEquivalentCny}
                            onChange={(e) => setAmountEquivalentCny(e.target.value)}
                            className="form-control"
                        />
                    </div>
                </fieldset>
                <button
                    type="submit"
                    className="submit-button"
                >
                    提交
                </button>
            </form>

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
        </div>
    );
}
