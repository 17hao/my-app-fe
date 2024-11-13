import { useState } from "react";

import "modules/lab/EarlyPayoffCalculator.css"

function EarlyPayoffCalculator() {
    document.title = "calculator";

    const [loanAmount, setLoanAmount] = useState("");
    const [loanTerm, setLoanTerm] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [repaymentOption, setRepaymentOption] = useState("fixedPrincipal"); // fixed principal | fixed payment
    const [prepaymentYear, setPrepaymentYear] = useState(new Date().getFullYear());
    const [prepaymentMonth, setPrepaymentMonth] = useState(new Date().getMonth() + 2);
    const [prepaymentAmount, setPrepaymentAmount] = useState("");
    const [newInterestRate, setNewInterestRate] = useState("");

    const [beforePrepaymentData, setBeforePrepaymentData] = useState([]);
    const [afterPrepaymentData, setAfterPrepaymentData] = useState([]);

    function selectLoanType(event) {
        setRepaymentOption(event.target.value);
    }

    function calculate() {
        let before = [];
        let after = [];

        const currentDate = new Date();
        const months = (prepaymentYear - currentDate.getFullYear()) * 12 + (prepaymentMonth - currentDate.getMonth() - 1);
        console.log(`months=${months}`);

        let remaingAmount = Number(loanAmount);
        let remaingMonth = Number(loanTerm);

        for (let i = 0; i < months; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 获取下一个月并格式化为两位数

            const principalPerMonth = Number((remaingAmount / remaingMonth).toFixed(2));
            const interestPerMonth = Number((remaingAmount * (interestRate / 100) / 12).toFixed(2));

            before.push({
                "idx": i + 1,
                "month": `${year}-${month}`,
                "repayment": (Number(principalPerMonth) + Number(interestPerMonth)).toFixed(2),
                "principal": principalPerMonth,
                "interest": interestPerMonth
            });

            remaingAmount -= principalPerMonth;
            remaingMonth -= 1;
        }

        remaingAmount -= prepaymentAmount;

        for (let i = 0; i < loanTerm - months; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 获取下一个月并格式化为两位数

            const principalPerMonth = Number((remaingAmount / remaingMonth).toFixed(2));
            const interestPerMonth = Number((remaingAmount * (newInterestRate / 100) / 12).toFixed(2));

            after.push({
                "idx": i + 1,
                "month": `${year}-${month}`,
                "repayment": (Number(principalPerMonth) + Number(interestPerMonth)).toFixed(2),
                "principal": principalPerMonth,
                "interest": interestPerMonth
            });

            remaingAmount -= principalPerMonth;
            remaingMonth -= 1;
        }

        return {
            "before": before,
            "after": after,
        };
    }

    function submitHandler(event) {
        event.preventDefault();

        if (prepaymentYear < new Date().getFullYear() ||
            (prepaymentYear === new Date().getFullYear() && prepaymentMonth <= new Date().getMonth() + 1)) {
            alert("提前还贷时间不能早于下月");
            return;
        }

        console.log(`totalAmount=${loanAmount} monthNum=${loanTerm} interest=${interestRate}`);

        const data = calculate();
        setBeforePrepaymentData(data.before);
        setAfterPrepaymentData(data.after);
    }

    function clearHandler(event) {
        event.preventDefault();

        setLoanAmount("");
        setLoanTerm("");
        setInterestRate("");
        setBeforePrepaymentData([]);
        setAfterPrepaymentData([]);
    }

    return (
        <div>
            <div className="title">提前还贷计算器</div>

            <form className="calculatorForm">
                <div className="container">
                    <div className="left">贷款金额</div>
                    <div className="input">
                        <input className="inputText" type="text" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}></input>
                    </div>
                    <div className="right">元</div>
                </div>
                <div className="container">
                    <div className="left">贷款月数</div>
                    <div className="input">
                        <input className="inputText" type="text" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)}></input>
                    </div>
                    <div className="right">月</div>
                </div>
                <div className="container">
                    <div className="left">贷款利率</div>
                    <div className="input">
                        <input className="inputText" type="text" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}></input>
                    </div>
                    <div className="right">%</div>
                </div>
                <div className="container">
                    <div className="left">还贷方式</div>
                    <div className="selection">
                        <label>
                            <input
                                type="radio"
                                value="fixedPrincipal"
                                checked={repaymentOption === 'fixedPrincipal'}
                                onChange={selectLoanType}
                            />
                            等额本金
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="fixedPaymen"
                                checked={repaymentOption === 'fixedPaymen'}
                            // onChange={selectLoanType}
                            />
                            等额本息
                        </label>
                    </div>
                </div>
                <div className="container">
                    <div className="left">提前还贷时间</div>
                    <div className="input">
                        <input className="inputText" type="text" value={prepaymentYear} onChange={(e) => setPrepaymentYear(e.target.value)}></input>
                    </div>
                    <div className="right">年</div>
                    <div className="input">
                        <input className="inputText" type="text" value={prepaymentMonth} onChange={(e) => setPrepaymentMonth(e.target.value)}></input>
                    </div>
                    <div className="right">月</div>
                </div>
                <div className="container">
                    <div className="left">提前还贷金额</div>
                    <div className="input">
                        <input className="inputText" type="text" value={prepaymentAmount} onChange={(e) => setPrepaymentAmount(e.target.value)}></input>
                    </div>
                    <div className="right">元</div>
                </div>
                <div className="container">
                    <div className="left">新的贷款利率</div>
                    <div className="input">
                        <input className="inputText" type="text" value={newInterestRate} onChange={(e) => setNewInterestRate(e.target.value)}></input>
                    </div>
                    <div className="right">%</div>
                </div>
                <div className="container">
                    <div className="button">
                        <button type="button" onClick={submitHandler}>计算</button>
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
                            {beforePrepaymentData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.idx}</td>
                                    <td>{data.month}</td>
                                    <td>{data.repayment}</td>
                                    <td>{data.principal}</td>
                                    <td>{data.interest}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan="5">⬇️提前还贷后新的还贷计划⬇️</td>
                            </tr>
                        </tbody>
                        <tbody>
                            {afterPrepaymentData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.idx}</td>
                                    <td>{data.month}</td>
                                    <td>{data.repayment}</td>
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
