import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import MarkdownRender from "modules/blog/MarkdownRender";

// const pathTitleMap = {
//     "calculus": "微积分笔记",
//     "charset": "字符编码",
//     "init_cloud_server": "云服务器配置脚本",
//     "lineaer_alg": "线性代数笔记",
//     "mst": "最小生成树",
//     "preseeding": "自动化安装Debian"
// }

const importAll = r => r.keys().map(r);
const markdownFiles = importAll(require.context("modules/blog/md_files", false, /\.\/.*\.md$/));
const promises = markdownFiles.map(async (f) => {
    return {
        path: f.split("/")[3].split(".")[0], // e.g. ./calculus.md => calculus
        text: await fetch(f).then(res => res.text())
    };
});
const blogs = await Promise.all(promises).catch(err => console.error(err));

export default class BlogList extends React.Component {
    state = {
        blogs: [
            {
                path: "",
                text: "",
            }
        ]
    };

    constructor() {
        super();
        this.state = { blogs: blogs };
    };

    render() {
        const itemStyle = {
            margin: "5px",
            color: "black"
        }

        // TODO: 和 basic-router 共用一份配置
        const blogs = [
            {
                "path": "charset",
                "title": "字符编码",
            },
            {
                "path": "calculus",
                "title": "微积分笔记",
            },
            {
                "path": "linear_alg",
                "title": "线性代数笔记",
            },
            {
                "path": "mst",
                "title": "最小生成树",
            },
            {
                "path": "init_cloud_server",
                "title": "云服务器配置脚本",
            },
            {
                "path": "preseeding",
                "title": "自动化安装Debian",
            }
        ]

        const items = blogs.map(blog =>
            <Link key={blog.path} to={"/blogs/" + blog.path} style={itemStyle} >
                <div>{blog.title}</div>
            </Link>
        )

        const blogRoutes = this.state.blogs.map(blog => {
            // console.log(blog)
            return <Route key={blog.path} path={"/blogs/" + blog.path} element={<MarkdownRender text={blog.text} />} />
        });

        return (
            <div>
                <Routes>
                    {blogRoutes}
                </Routes>
                <div style={{ marginLeft: "3%" }}>
                    {items}
                </div>
            </div>
        )
    }
}
