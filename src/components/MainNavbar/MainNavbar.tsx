import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import styles from "./main-navbar.module.css";


export default function NaiveNavbar(): React.ReactElement {
    const linkMap = new Map<string, string>();
    linkMap.set("/", "Home");
    linkMap.set("/blog", "Blog");
    linkMap.set("/about", "About");
    linkMap.set("/lab", "Lab");

    const links = Array.from(linkMap).map(([k, v]) => (
        <Link to={k} className={styles.navLink} key={k}>
            {v}
        </Link>
    ));

    return (
        <Navbar className={styles.navbar}>
            <Nav>
                <div className={styles.navItems}>
                    {links}
                </div>
            </Nav>
        </Navbar>
    );
}
