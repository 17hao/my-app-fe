import React from "react";
import { Link } from "react-router-dom";
import "./blog.css"

export default function Blog(props) {
    const links = props.posts.map(post =>
        <Link key={post.path} to={"/blog/" + post.path} style={{ color: "black" }} className="post-link">
            <div>{post.title}</div>
        </Link>
    )

    return (
        <div>
            {links}
        </div>
    )
}
