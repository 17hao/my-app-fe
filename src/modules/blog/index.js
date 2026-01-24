import { Link } from "react-router-dom";
import { pathToTitle } from "modules/blog/common"
import "./index.css"

export default function BlogIndex() {
    document.title = "Blog";

    const items = Array.from(pathToTitle).map(([path, title]) => {
        return (
            <li key={path} className="blog-item">
                <Link rel="canonical" to={"/blog/" + path} className="blog-item-link">
                    <h2 className="blog-item-title">{title}</h2>
                </Link>
            </li>
        );
    });

    return (
        <div className="blog-index-container">
            <h1 className="blog-index-title">博客文章</h1>
            <ul className="blog-list">
                {items}
            </ul>
        </div>
    );
}
