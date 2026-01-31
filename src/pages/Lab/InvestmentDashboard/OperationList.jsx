import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "@/config/env";
import { PLATFORM_OPTIONS, OP_TYPE_OPTIONS, OP_ITEM_L1_TYPE_OPTIONS, OP_ITEM_L2_TYPE_OPTIONS, cny, hkd, usd } from "./consts";
import "./InvestmentDashboad.css";

export default function OperationList() {
    const navigate = useNavigate();
    const [opDate, setOpDate] = useState("");
    // 注意：这里存的是 code（value），不是展示文案
    const [opPlatform, setOpPlatform] = useState("");
    const [opType, setOpType] = useState("");

    const [opItemSymbol, setOpItemSymbol] = useState("");
    const [opItemL1Type, setOpItemL1Type] = useState("");
    const [opItemL2Type, setOpItemL2Type] = useState("");

    const [amountNumber, setAmountNumber] = useState("");
    const [amountCurrency, setAmountCurrency] = useState(cny);
    const [amountEquivalentCny, setAmountEquivalentCny] = useState("");

    const [opRecords, setOpRecords] = useState([]);

    // 分页状态
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);
    const [jumpPageInput, setJumpPageInput] = useState("");

    // 控制表单显示/隐藏
    const [showForm, setShowForm] = useState(false);

    // 查询投资操作流水列表（分页）
    async function fetchOperations() {
        let url = getApiUrl("/investment/operations");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pageNum: pageNum,
                    pageSize: pageSize,
                }),
            });

            if (!response.ok) {
                console.error("获取投资操作流水失败，HTTP 状态码:", response.status);
                return;
            }

            const respBody = await response.json();
            console.log("fetch operations response", respBody);

            if (respBody.code === "0" && respBody.data) {
                setOpRecords(Array.isArray(respBody.data.list) ? respBody.data.list : []);
                setTotalRecords(respBody.data.total || 0);
            } else {
                console.warn("响应数据格式不符合预期");
            }
        } catch (err) {
            console.error("获取投资操作流水时发生错误", err);
        }
    }

    useEffect(() => {
        document.title = "投资操作流水";
    }, []);

    // 当分页参数变化时，重新获取数据
    useEffect(() => {
        fetchOperations();
    }, [pageNum, pageSize]);

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

        let url = getApiUrl("/investment/operation");

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
            setAmountCurrency(cny);
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

    // 分页计算
    const totalPages = Math.ceil(totalRecords / pageSize);

    // 处理上一页
    const handlePrevPage = () => {
        if (pageNum > 1) {
            setPageNum(pageNum - 1);
        }
    };

    // 处理下一页
    const handleNextPage = () => {
        if (pageNum < totalPages) {
            setPageNum(pageNum + 1);
        }
    };

    // 处理每页条数变化
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setPageNum(1); // 重置到第一页
    };

    // 处理页面跳转
    const handleJumpToPage = () => {
        const targetPage = parseInt(jumpPageInput);
        if (isNaN(targetPage) || targetPage < 1 || targetPage > totalPages) {
            alert(`请输入有效的页码（1-${totalPages}）`);
            return;
        }
        setPageNum(targetPage);
        setJumpPageInput(""); // 清空输入框
    };

    // 处理回车键跳转
    const handleJumpInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleJumpToPage();
        }
    };

    return (
        <div className="investment-dashboard-page">
            {/* 表格放在表单上方 */}
            <div className="investment-dashboard-table-section">
                <div className="table-header">
                    <button
                        className="add-record-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '收起录入表单' : '+ 新增记录'}
                    </button>
                    <h2 className="investment-dashboard-table-title">投资操作流水表</h2>
                    <button
                        className="add-record-btn"
                        onClick={() => navigate(-1)}
                        style={{ backgroundColor: '#6c757d' }}
                    >
                        ← 返回
                    </button>
                </div>

                {/* 桌面端表格视图 */}
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
                        {opRecords.map((item, index) => {
                            const opPlatformLabel = PLATFORM_OPTIONS.find(p => p.value === item.opPlatform)?.label || item.opPlatform;
                            const opTypeLabel = OP_TYPE_OPTIONS.find(t => t.value === item.opType)?.label || item.opType;

                            // 操作对象：既兼容字符串字段，也兼容嵌套对象
                            let opItemDisplay = null;
                            if (typeof item.opItem === "string") {
                                opItemDisplay = <span className="op-item-text">{item.opItem}</span>;
                            } else if (item.opItem && typeof item.opItem === "object") {
                                const l1Label = OP_ITEM_L1_TYPE_OPTIONS.find(l1 => l1.value === item.opItem.l1Type)?.label || item.opItem.l1Type || "";
                                // 二级分类 label 反查
                                const allL2 = Object.values(OP_ITEM_L2_TYPE_OPTIONS).flat();
                                const l2Label = item.opItem.l2Type
                                    ? (allL2.find(l2 => l2.value === item.opItem.l2Type)?.label || item.opItem.l2Type)
                                    : "";

                                opItemDisplay = (
                                    <div className="op-item-container">
                                        <div className="op-item-field">
                                            <span className="op-item-label">编号</span>
                                            <span className="op-item-symbol">{item.opItem.symbol || ""}</span>
                                        </div>
                                        <div className="op-item-field">
                                            <span className="op-item-label">一级分类</span>
                                            <span className="op-item-badge op-item-l1">{l1Label}</span>
                                        </div>
                                        {l2Label && (
                                            <div className="op-item-field">
                                                <span className="op-item-label">二级分类</span>
                                                <span className="op-item-badge op-item-l2">{l2Label}</span>
                                            </div>
                                        )}
                                    </div>
                                );
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
                                    <td>{opItemDisplay}</td>
                                    <td>{amountText}</td>
                                    <td>{amountCnyText}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* 移动端卡片视图 */}
                <div className="investment-dashboard-table-mobile">
                    {opRecords.map((item, index) => {
                        const opPlatformLabel = PLATFORM_OPTIONS.find(p => p.value === item.opPlatform)?.label || item.opPlatform;
                        const opTypeLabel = OP_TYPE_OPTIONS.find(t => t.value === item.opType)?.label || item.opType;

                        // 操作对象：既兼容字符串字段，也兼容嵌套对象
                        let opItemDisplay = null;
                        if (typeof item.opItem === "string") {
                            opItemDisplay = <span className="op-item-text">{item.opItem}</span>;
                        } else if (item.opItem && typeof item.opItem === "object") {
                            const l1Label = OP_ITEM_L1_TYPE_OPTIONS.find(l1 => l1.value === item.opItem.l1Type)?.label || item.opItem.l1Type || "";
                            // 二级分类 label 反查
                            const allL2 = Object.values(OP_ITEM_L2_TYPE_OPTIONS).flat();
                            const l2Label = item.opItem.l2Type
                                ? (allL2.find(l2 => l2.value === item.opItem.l2Type)?.label || item.opItem.l2Type)
                                : "";

                            opItemDisplay = (
                                <div className="op-item-container">
                                    <div className="op-item-field">
                                        <span className="op-item-label">编号</span>
                                        <span className="op-item-symbol">{item.opItem.symbol || ""}</span>
                                    </div>
                                    <div className="op-item-field">
                                        <span className="op-item-label">一级分类</span>
                                        <span className="op-item-badge op-item-l1">{l1Label}</span>
                                    </div>
                                    {l2Label && (
                                        <div className="op-item-field">
                                            <span className="op-item-label">二级分类</span>
                                            <span className="op-item-badge op-item-l2">{l2Label}</span>
                                        </div>
                                    )}
                                </div>
                            );
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
                            <div key={index} className="record-card">
                                <div className="record-card-header">
                                    <span className="record-card-header-item">{item.opDate}</span>
                                    <span className="record-card-header-item">{opPlatformLabel}</span>
                                    <span className="record-card-header-item">{opTypeLabel}</span>
                                </div>
                                <div className="record-card-row record-card-row-op-item">
                                    {opItemDisplay}
                                </div>
                                <div className="record-card-row-double">
                                    <div className="record-card-item">
                                        <span className="record-card-label-inline">金额：</span>
                                        <span className="record-card-value-inline">{amountText}</span>
                                    </div>
                                    <div className="record-card-item">
                                        <span className="record-card-label-inline">等值人民币：</span>
                                        <span className="record-card-value-inline">{amountCnyText}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 分页控件 */}
                <div className="pagination-controls">
                    <div className="pagination-info">
                        <span>共 {totalRecords} 条记录</span>
                        <span style={{ marginLeft: '20px' }}>
                            每页显示
                            <select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                style={{ margin: '0 8px' }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            条
                        </span>
                    </div>
                    <div className="pagination-buttons">
                        <button
                            onClick={handlePrevPage}
                            disabled={pageNum === 1}
                            className="pagination-btn"
                        >
                            上一页
                        </button>
                        <div className="pagination-page-input-wrapper">
                            <span>第</span>
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={jumpPageInput}
                                onChange={(e) => setJumpPageInput(e.target.value)}
                                onKeyPress={handleJumpInputKeyPress}
                                placeholder={String(pageNum)}
                                className="pagination-page-input"
                            />
                            <span>/ {totalPages || 1} 页</span>
                        </div>
                        <button
                            onClick={handleNextPage}
                            disabled={pageNum >= totalPages}
                            className="pagination-btn"
                        >
                            下一页
                        </button>
                        <button
                            onClick={handleJumpToPage}
                            disabled={totalPages === 0 || !jumpPageInput}
                            className="pagination-btn pagination-jump-btn"
                        >
                            跳转
                        </button>
                    </div>
                </div>
            </div>

            {/* 录入表单弹窗 */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">投资操作流水录入</h3>
                            <button className="modal-close-btn" onClick={() => setShowForm(false)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <form
                                onSubmit={submitHandler}
                                className="investment-dashboard-form-inline"
                            >
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
                                            <option value="cny">{cny}</option>
                                            <option value="usd">{usd}</option>
                                            <option value="hkd">{hkd}</option>
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
                    </div>
                </div>
            )}
        </div>
    );
}
