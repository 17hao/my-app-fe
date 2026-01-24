import React, { useEffect } from "react";
import styles from "./home-page.module.css";

export default function Home(): React.ReactElement {
    useEffect(() => {
        document.title = "信息记录";
    }, []);

    return (
        <div className={styles.home}>
            <div className={styles.content}>
                <div>Welcome!</div>
            </div>
            <div>This is the home page.</div>
        </div>
    );
}
