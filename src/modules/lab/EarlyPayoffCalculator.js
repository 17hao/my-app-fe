import { useState } from "react";

import "modules/lab/EarlyPayoffCalculator.css"

function EarlyPayoffCalculator() {
    document.title = "calculator";

    const currentDate = new Date();
    const prepaymentDate = new Date(new Date().setMonth(new Date().getMonth() + 2));

    const [loanAmount, setLoanAmount] = useState("");
    const [loanTerm, setLoanTerm] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [repaymentOption, setRepaymentOption] = useState("fixedPrincipal"); // fixed principal | fixed payment
    const [prepaymentYear, setPrepaymentYear] = useState(prepaymentDate.getFullYear());
    const [prepaymentMonth, setPrepaymentMonth] = useState(prepaymentDate.getMonth() + 1);
    const [prepaymentAmount, setPrepaymentAmount] = useState("");
    const [newInterestRate, setNewInterestRate] = useState("");

    const [beforePrepaymentData, setBeforePrepaymentData] = useState([]);
    const [afterPrepaymentData, setAfterPrepaymentData] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    function selectLoanType(event) {
        setRepaymentOption(event.target.value);
    }

    function submitHandler(event) {
        event.preventDefault();

        if (loanAmount === "" || loanTerm === "" || interestRate === "") {
            alert("输入不合法");
            return;
        }

        if (Number(prepaymentYear) < currentDate.getFullYear() ||
            (Number(prepaymentYear) === currentDate.getFullYear() && Number(prepaymentMonth) <= currentDate.getMonth() + 1)) {
            alert("提前还贷时间不能早于下月");
            return;
        }

        const data = calculate();
        setBeforePrepaymentData(data.before);
        setAfterPrepaymentData(data.after);
        setIsSubmitted(true);
    }

    function calculate() {
        if (repaymentOption === 'fixedPrincipal') {
            let remaingAmount = Number(loanAmount);
            let remaingMonths = Number(loanTerm);
            let repaymentMonthsPartA = (prepaymentYear - currentDate.getFullYear()) * 12 + (prepaymentMonth - currentDate.getMonth() - 1);
            let rate = interestRate;
            const before = fixedPrincipal(remaingAmount, remaingMonths, rate, currentDate, repaymentMonthsPartA);

            remaingAmount -= (loanAmount / loanTerm) * repaymentMonthsPartA;
            remaingAmount -= prepaymentAmount;
            remaingMonths = loanTerm - repaymentMonthsPartA;
            let repaymentMonthsPartB = remaingMonths;
            if (newInterestRate !== "") {
                rate = newInterestRate;
            }
            const after = fixedPrincipal(remaingAmount, remaingMonths, rate, currentDate, repaymentMonthsPartB);

            return {
                "before": before,
                "after": after,
            };
        } else if (repaymentOption === 'fixedPayment') {
            let remaingAmount = Number(loanAmount);
            let remaingMonths = Number(loanTerm);
            let repaymentMonthsPartA = (prepaymentYear - currentDate.getFullYear()) * 12 + (prepaymentMonth - currentDate.getMonth() - 1);
            let rate = interestRate;
            const before = fixedPayment(remaingAmount, remaingMonths, rate, currentDate, repaymentMonthsPartA);

            remaingAmount -= (loanAmount / loanTerm) * repaymentMonthsPartA;
            remaingAmount -= prepaymentAmount;
            remaingMonths = loanTerm - repaymentMonthsPartA;
            let repaymentMonthsPartB = remaingMonths;
            if (newInterestRate !== "") {
                rate = newInterestRate;
            }
            const after = fixedPayment(remaingAmount, remaingMonths, rate, currentDate, repaymentMonthsPartB);

            return {
                "before": before,
                "after": after,
            };
        }
    }

    function fixedPrincipal(remaingAmount, remaingMonths, rate, currentDate, repaymentMonths) {
        console.log(`remaingAmount=${remaingAmount} remaingMonths=${remaingMonths} currentDate=${currentDate}`);

        let res = [];

        for (let i = 0; i < repaymentMonths; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 获取下一个月并格式化为两位数

            const principalPerMonth = Number((remaingAmount / remaingMonths).toFixed(2));
            const interestPerMonth = Number((remaingAmount * (rate / 100) / 12).toFixed(2));

            res.push({
                "idx": i + 1,
                "month": `${year}-${month}`,
                "repayment": (Number(principalPerMonth) + Number(interestPerMonth)).toFixed(2),
                "principal": principalPerMonth,
                "interest": interestPerMonth
            });

            remaingAmount -= principalPerMonth;
            remaingMonths -= 1;
        }

        return res;
    }

    function fixedPayment(remaingAmount, remaingMonths, rate, currentDate, repaymentMonths) {
        let res = [];
        let monthlyRate = rate / 100 / 12;
        let monthlyPayment = (remaingAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -remaingMonths));
        for (let i = 0; i < repaymentMonths; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const interest = Number((remaingAmount * monthlyRate).toFixed(2));
            const principal = Number((monthlyPayment - interest).toFixed(2));
            res.push({
                "idx": i + 1,
                "month": `${year}-${month}`,
                "repayment": monthlyPayment.toFixed(2),
                "principal": principal,
                "interest": interest
            });
            remaingAmount -= principal;
        }
        return res;
    }

    function clearHandler(event) {
        event.preventDefault();

        setLoanAmount("");
        setLoanTerm("");
        setInterestRate("");
        setBeforePrepaymentData([]);
        setAfterPrepaymentData([]);
        setIsSubmitted(false);
    }

    const outputDetails =
        <div>
            <div className="detailTitle">还款明细</div>
            <div>
                <table className="detailTable">
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
                    {
                        afterPrepaymentData.length > 0 ?
                            <tbody>
                                <tr>
                                    <td colSpan="5">&emsp;&emsp;⬇️提前还贷后新的还款计划⬇️</td>
                                </tr>
                            </tbody>
                            : <></>
                    }
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
                                value="fixedPayment"
                                checked={repaymentOption === 'fixedPayment'}
                                onChange={selectLoanType}
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
                        <input placeholder="不填为0" className="inputText" type="text" value={prepaymentAmount} onChange={(e) => setPrepaymentAmount(e.target.value)}></input>
                    </div>
                    <div className="right">元</div>
                </div>
                <div className="container">
                    <div className="left">新的贷款利率</div>
                    <div className="input">
                        <input placeholder="不填利率不变" className="inputText" type="text" value={newInterestRate} onChange={(e) => setNewInterestRate(e.target.value)}></input>
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

            {isSubmitted && (
                <div className="details">
                    <div className="detailTitle">还款明细</div>
                    <div>
                        <table className="detailTable">
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
                            {
                                afterPrepaymentData.length > 0 ?
                                    <tbody>
                                        <tr>
                                            <td colSpan="5">&emsp;&emsp;⬇️提前还贷后新的还款计划⬇️</td>
                                        </tr>
                                    </tbody>
                                    : <></>
                            }
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
            )}
        </div>
    );

}

export default EarlyPayoffCalculator;
