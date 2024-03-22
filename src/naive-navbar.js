import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'

export default function NaiveNavbar() {
    const navbarStyle = {
        height: "50px",
        backgroundColor: "#404040"
    }

    const linkStyle = {
        display: "inline-block",
        paddingTop: "10px",
        paddingLeft: "30px",
        color: "#6495ED",
        fontSize: "20px"
    }

    const linkMap = new Map()
    linkMap.set("/", "Home")
    linkMap.set("/blogs", "Blogs")
    linkMap.set("/about", "About")

    const links = (
        Array.from(linkMap).map(([k, v]) =>
            (<Link to={k} style={linkStyle} key={k}>{v}</Link>)
        )
    )

    return (
        <Navbar>
            <Nav style={navbarStyle}>
                {links}
            </Nav>
        </Navbar>
    )
}