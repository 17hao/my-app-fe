import React from "react";
import BasicRouter from "./basic-router";
import Footer from "./footer";
import 'bootstrap/dist/css/bootstrap.min.css';

let style = {
    minHeight: "calc(100vh - 25px)"
}

export default function App() {
    return (
        <div>
            <div className="app" style={style}>
                <BasicRouter />
            </div>
            <Footer />
        </div>
    );
}
