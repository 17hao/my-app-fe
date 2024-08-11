import React from "react";
import { BrowserRouter } from "react-router-dom";
import BasicRouter from "basic-router";
import NaiveNavbar from "naive-navbar";
import Footer from "footer";
import "App.css";

export default function App() {
    return (
        <BrowserRouter >
            <div className="app">
                <NaiveNavbar />
                <BasicRouter />
            </div>
            <Footer />
        </BrowserRouter>
    );
}
