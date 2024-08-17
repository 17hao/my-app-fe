import { Routes, Route } from "react-router-dom";
import Home from "modules/home/home";
import BlogIndex from "modules/blog/BlogIndex";
import About from "modules/about/about";
import { MarkdownRender } from "modules/blog/MarkdownRender";

export default function MainRouter() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="blogs">
                <Route index element={<BlogIndex />} />
                <Route path=":path" element={<MarkdownRender />} />
            </Route>
            <Route path="about" element={<About />} />
        </Routes>
    );
}
