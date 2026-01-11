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
        { value: "intermediateTerm", label: "中期国债（3-10Y）" },
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

    // 查询完整的投资操作流水列表
    async function fetchOperations() {
        let path = "/investment/operation-logs";
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

    useEffect(() => {
        document.title = "投资流水录入";
        fetchOperations();
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

        let path = "/investment/operation-log";
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
            // 重新拉取完整流水记录列表
            fetchOperations();
        } catch (err) {
            console.error(err);
            alert("提交时发生错误，请稍后重试");
        }
    }

    const currentL2Options = OP_ITEM_L2_TYPE_OPTIONS[opItemL1Type] || [];

    // 按日期倒序排序（假定为 YYYY-MM-DD 格式）
    const sortedRecords = [...opRecords].sort((a, b) => {
        const da = a.opDate || "";
        const db = b.opDate || "";
        return db.localeCompare(da);
    });

    return (
        <div className="investment-dashboard-page">
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
        </div>
    );
}
