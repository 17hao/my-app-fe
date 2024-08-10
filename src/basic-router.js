import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from 'home'
import Blogs from 'blogs'
import About from 'about'
import MarkdownRender from 'markdown-render'
import initCloudServer from 'md_files/init_cloud_server.md'
import mst from 'md_files/mst.md'
import linearAlg from 'md_files/linear_alg.md'
import charset from 'md_files/charset.md'
import calculus from 'md_files/calculus.md'
import preseeding from 'md_files/preseeding.md'

export default function BasicRouter() {
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
            "title": "云服务器配置脚本",
            "content": initCloudServer,
        },
        {
            "path": "preseeding",
            "title": "自动化安装Debian",
            "content": preseeding,
        }
    ]


    const blogRoutes = (
        posts.map(post =>
            <Route key={post.path} path={"/blogs/" + post.path} element={<MarkdownRender content={post.content} />} />
        )
    )

    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact key="blogs" path="/blogs" element={<Blogs posts={posts} />} />
            <Route exact key="about" path="/about" element={<About />} />
            {blogRoutes}
        </Routes>
    )
}
