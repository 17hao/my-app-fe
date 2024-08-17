import { Link } from "react-router-dom";

// const pathTitleMap = {
//     "calculus": "微积分笔记",
//     "charset": "字符编码",
//     "init_cloud_server": "云服务器配置脚本",
//     "lineaer_alg": "线性代数笔记",
//     "mst": "最小生成树",
//     "preseeding": "自动化安装Debian"
// }

export default function BlogIndex() {
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
    ];

    const itemStyle = {
        margin: "5px",
        color: "black",
        textDecoration: "none",
    };

    const items = blogs.map(blog =>
        <Link key={blog.path} to={"/blogs/" + blog.path} style={itemStyle} >
            <div>{blog.title}</div>
        </Link>
    );

    return (
        <div style={{ marginLeft: "3%" }}>
            {items}
        </div>
    );
}
