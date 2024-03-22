import React from "react";
import NaiveRouter from "./naive-router";
import Footer from "./footer";

let style = {
    minHeight: "calc(100vh - 20px)"
}

export default function App() {
    return (
        <div>
            <div className="router" style={style}>
                <NaiveRouter />
            </div>
            <Footer />
        </div>
    );
}
