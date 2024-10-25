import { Routes, Route } from "react-router-dom";
import NotFound from "modules/common/components/NotFound";
import Home from "modules/home/home";
import BlogIndex from "modules/blog/index";
import About from "modules/about/about";
import { MarkdownRender } from "modules/blog/MarkdownRender";
import Login from "modules/auth/index"
import Lab from "modules/lab";
import RequireAuth from "modules/common/components/RequireAuth";

export default function MainRouter() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="blog">
                <Route index element={<BlogIndex />} />
                <Route path=":path" element={<MarkdownRender />} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="lab" element={<RequireAuth chilren={<Lab />} />} />
            <Route path='*' element={<NotFound />} status={404} />
        </Routes>
    );
}
