import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home/Home";
import BlogList from "@/pages/Blog/BlogList/BlogList";
import BlogDetail from "@/pages/Blog/BlogDetail/BlogDetail";
import About from "@/pages/About/About";
import Lab from "@/pages/Lab/Lab";
import PrepaymentCalculator from "@/pages/Lab/PrepaymentCalculator/PrepaymentCalculator";
import InvestmentDashboard from "@/pages/Lab/InvestmentDashboard/InvestmentDashboard.jsx";
import CostDistribution from "@/pages/Lab/InvestmentDashboard/CostDistribution.jsx";
import OperationList from "@/pages/Lab/InvestmentDashboard/OperationList.jsx";
import Login from "@/pages/Login/Login";
// import RequireAuth from "modules/account/RequireAuth";

export default function MainRouter(): React.ReactElement {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="blog">
                <Route index element={<BlogList />} />
                <Route path=":path" element={<BlogDetail />} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path="lab">
                <Route index element={<Lab />} />
                <Route path="prepayment-calculator" element={<PrepaymentCalculator />} />
                <Route path="investment-dashboard" element={<InvestmentDashboard />} />
                <Route path="investment-dashboard/cost-distribution" element={<CostDistribution />} />
                <Route path="investment-dashboard/operation-list" element={<OperationList />} />
            </Route>
            <Route path="login" element={<Login />} />
            {/* <Route path='*' element={<NotFound />} /> */}
        </Routes>
    );
}
