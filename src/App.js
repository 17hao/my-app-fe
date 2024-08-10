import React from "react";
import { BrowserRouter } from 'react-router-dom'
import BasicRouter from "basic-router";
import NaiveNavbar from 'naive-navbar'
import Footer from "footer";

export default function App() {
    const style = {
        minHeight: "calc(100vh - 25px)"
    }

    return (
        <BrowserRouter >
            <div className="app" style={style}>
                <NaiveNavbar />
                <BasicRouter />
            </div>
            <Footer />
        </BrowserRouter>
    );
}
