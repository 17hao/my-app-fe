import React from "react";
import { Link } from "react-router-dom";

export default function Blogs(props) {
    const itemStyle = {
        margin: "5px",
        color: "black"
    }

    const items = props.posts.map(post =>
        <Link className="post-link" key={post.path} to={"/blogs/" + post.path} style={itemStyle} >
            <div>{post.title}</div>
        </Link>
    )

    return (
        <div style={{ marginLeft: "3%" }}>
            {items}
        </div>
    )
}
