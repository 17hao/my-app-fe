import { useState } from "react";

import "modules/lab/EarlyPayoffCalculator.css"

function EarlyPayoffCalculator() {
    document.title = "calculator";

    const [principal, setPrincipal] = useState("");
    const [monthNum, setMonthNum] = useState("");
    const [rate, setRate] = useState("");

    const [tableData, setTableData] = useState([]);

    function calculate() {
        let res = [];

        const currentDate = new Date();

        for (let i = 0; i < monthNum; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 获取下一个月并格式化为两位数

            const principalPerMonth = Number((principal / monthNum).toFixed(2));
            const interestPerMonth = Number((principal * ((monthNum - i) / monthNum) * (rate / 100) / 12).toFixed(2));

            res.push({
                "idx": i + 1,
                "month": `${year}-${month}`,
                "amount": (principalPerMonth + interestPerMonth).toFixed(2),
                "principal": principalPerMonth,
                "interest": interestPerMonth
            });
        }

        return res;
    }

    function submitHandler(event) {
        event.preventDefault();

        console.log(`totalAmount=${principal} monthNum=${monthNum} interest=${rate}`);

        setTableData(calculate());
    }

    function clearHandler(event) {
        event.preventDefault();

        setPrincipal("");
        setMonthNum("");
        setRate("");
        setTableData([]);
    }

    return (
        <div>
            <form className="calculatorForm">
                <div className="title">提前还贷计算器</div>
                <div className="container">
                    <div className="left">贷款金额</div>
                    <div className="input">
                        <input type="text" value={principal} onChange={(e) => setPrincipal(e.target.value)}></input>
                    </div>
                    <div className="right">元</div>
                </div>
                <div className="container">
                    <div className="left">贷款月数</div>
                    <div className="input">
                        <input type="text" value={monthNum} onChange={(e) => setMonthNum(e.target.value)}></input>
                    </div>
                    <div className="right">月</div>
                </div>
                <div className="container">
                    <div className="left">贷款利率</div>
                    <div className="input">
                        <input type="text" value={rate} onChange={(e) => setRate(e.target.value)}></input>
                    </div>
                    <div className="right">%</div>
                </div>
                <div className="container">
                    <div className="button">
                        <button type="button" onClick={submitHandler}>提交</button>
                    </div>
                    <div className="button">
                        <button type="button" onClick={clearHandler}>清空</button>
                    </div>
                </div>
            </form>

            <div className="details">
                <div className="title">还款明细</div>
                <div>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>还款月份</th>
                                <th>还款金额</th>
                                <th>本金</th>
                                <th>利息</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.idx}</td>
                                    <td>{data.month}</td>
                                    <td>{data.amount}</td>
                                    <td>{data.principal}</td>
                                    <td>{data.interest}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EarlyPayoffCalculator;
