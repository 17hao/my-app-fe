import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "modules/home/home";
import BlogList from "modules/blog/BlogList";
import About from "modules/about/about";

export default class MainRouter extends React.Component {
    render() {
        return (
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact key="blogs" path="/*" element={<BlogList />} />
                <Route exact key="about" path="/about" element={<About />} />
            </Routes>
        );
    };
}
