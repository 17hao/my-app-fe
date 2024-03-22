import React from "react";
import { Link } from "react-router-dom";

export default function Blog(props) {
    const style = {
        margin: "10px",
        color: "black"
    }

    const links = props.posts.map(post =>
        <Link className="post-link" key={post.path} to={"/blog/" + post.path} style={style} >
            <div>{post.title}</div>
        </Link>
    )

    return (
        <div>
            {links}
        </div>
    )
}
