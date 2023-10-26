import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './home';
import Blog from './blog';
import About from './about';
import NaiveNavbar from "./naive-navbar";
import MarkdownRender from './markdown-render';
import initCloudServer from './md_files/init_cloud_server.md';
import mst from './md_files/mst.md';
import linearAlg from './md_files/linear_alg.md';
import charset from './md_files/charset.md';
import calculus from './md_files/calculus.md';

function NaiveRouter(props) {
    const posts = [
        {
            "path": "charset",
            "title": "字符编码",
            "content": charset,
        },
        {
            "path": "calculus",
            "title": "微积分笔记",
            "content": calculus,
        },
        {
            "path": "lineaer_alg",
            "title": "线性代数笔记",
            "content": linearAlg,
        },
        {
            "path": "mst",
            "title": "最小生成树",
            "content": mst,
        },
        {
            "path": "init_cloud_server",
            "title": "云服务器部署脚本",
            "content": initCloudServer,
        }
    ]


    const blogRoutes = (
        posts.map(post =>
            <Route key={post.path} path={"/blog/" + post.path} render={() => <MarkdownRender content={post.content} />} />
        )
    )

    return (
        <BrowserRouter>
            <NaiveNavbar />
            <Route exact path="/" render={() => <Home />} />
            <Route key="blog" path="/blog" render={() => <Blog posts={posts} />} />
            <Route key="about" path="/about" render={() => <About />} />
            {blogRoutes}
        </BrowserRouter>
    )
}

export default NaiveRouter;
