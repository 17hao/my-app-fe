import React from "react";
import { Link } from "react-router-dom";
import styles from "./lab-page.module.css";

export default function Lab(): React.ReactElement {
    document.title = "Lab";

    return (
        <div className={styles.labContainer}>
            <div className={styles.labTitle}>
                ✨ Laboratory
            </div>
            <div className={styles.labLinks}>
                <Link to={"investment-dashboard"} className={styles.labLinkItem}>
                    <span className={styles.labLinkIcon}>📈</span>
                    <span className={styles.labLinkText}>投资数据看板</span>
                </Link>
                <Link to={"prepayment-calculator"} className={styles.labLinkItem}>
                    <span className={styles.labLinkIcon}>💰</span>
                    <span className={styles.labLinkText}>提前还贷计算器</span>
                </Link>
                <Link to={"xss-attack-demo"} className={styles.labLinkItem}>
                    <span className={styles.labLinkIcon}>⚔️</span>
                    <span className={styles.labLinkText}>XSS攻击演示</span>
                </Link>
            </div>
        </div>
    );
}
