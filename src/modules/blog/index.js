import { Link } from "react-router-dom";
import { pathToTitle } from "modules/blog/common"

export default function BlogIndex() {
    const items = Array.from(pathToTitle).map(([path, title]) => {
        const itemStyle = {
            margin: "5px",
            color: "black",
            textDecoration: "none",
        };

        return (
            <Link rel="canonical" key={path} to={"/blog/" + path} style={itemStyle} >
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
