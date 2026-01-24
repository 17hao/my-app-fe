import React from "react";
import { Link } from "react-router-dom";
import { pathToTitleMap } from "@/pages/Blog/constants";
import styles from "./blog-list-page.module.css";

export default function BlogList(): React.ReactElement {
    document.title = "博客列表页";

    const items = Array.from(pathToTitleMap).map(([path, title]) => {
        return (
            <li key={path} className={styles.blogItem}>
                <Link rel="canonical" to={"/blog/" + path} className={styles.blogItemLink}>
                    <h2 className={styles.blogItemTitle}>{title}</h2>
                </Link>
            </li>
        );
    });

    return (
        <div className={styles.blogIndexContainer}>
            <h1 className={styles.blogIndexTitle}>博客列表</h1>
            <ul className={styles.blogList}>
                {items}
            </ul>
        </div>
    );
}
