import { Link } from "react-router-dom";

export default function BlogIndex() {
    const pathTitleMap = new Map([
        ["calculus", "微积分笔记"],
        ["charset", "字符编码"],
        ["linear-alg", "线性代数笔记"],
        ["init-cloud-server", "云服务器配置脚本"],
        ["mst", "最小生成树"],
        ["preseed", "自动化安装Debian"],
        ["iptables", "iptables讲解"],
        ["container-network", "简易版docker网络（Bash版）"],
        ["naive-runc", "简易版runc（Golang版）"],
    ]);

    const items = Array.from(pathTitleMap).map(([path, title]) => {
        const itemStyle = {
            margin: "5px",
            color: "black",
            textDecoration: "none",
        };

        return (
            <Link key={path} to={"/blogs/" + path} style={itemStyle} >
                <div>{title}</div>
            </Link>
        );
    });

    return (
        <div style={{ marginLeft: "3%" }}>
            {items}
        </div>
    );
}
