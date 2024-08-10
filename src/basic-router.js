import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from 'home'
import Blogs from 'blogs'
import About from 'about'
import MarkdownRender from 'markdown-render'

// const pathTitleMap = {
//     "calculus": "微积分笔记",
//     "charset": "字符编码",
//     "init_cloud_server": "云服务器配置脚本",
//     "lineaer_alg": "线性代数笔记",
//     "mst": "最小生成树",
//     "preseeding": "自动化安装Debian"
// }

const importAll = r => r.keys().map(r)
const markdownFiles = importAll(require.context("md_files", false, /\.\/.*\.md$/))
const promises = markdownFiles.map(async (f) => {
    return {
        path: f.split("/")[3].split(".")[0], // e.g. ./calculus.md => calculus
        text: await fetch(f).then(res => res.text())
    }
})
const blogs = await Promise.all(promises).catch(err => console.error(err))

class BasicRouter extends React.Component {
    state = {
        blogs: [
            {
                path: "",
                text: "",
            }
        ]
    }

    constructor() {
        super()
        this.state = { blogs: blogs }
    }

    render() {
        const blogRoutes = this.state.blogs.map(blog => {
            // console.log(blog)
            return <Route key={blog.path} path={"/blogs/" + blog.path} element={<MarkdownRender text={blog.text} />} />
        })

        return (
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact key="blogs" path="/blogs" element={<Blogs />} />
                <Route exact key="about" path="/about" element={<About />} />
                {blogRoutes}
            </Routes>
        )
    }
}

export default BasicRouter
