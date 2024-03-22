import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

export default function NaiveNavbar() {
    const style = {
        marginRight: "20px",
        fontSize: "20px"
    }

    const linkMap = new Map()
    linkMap.set("/", "Home")
    linkMap.set("/blog", "Blog")
    linkMap.set("/about", "About")

    const links = (
        Array.from(linkMap).map(([k, v]) =>
            (<Link to={k} style={style} key={k}>{v}</Link>)
        )
    )

    return (
        <Navbar expand="lg">
            <Nav>
                {links}
            </Nav>
        </Navbar>
    )
}