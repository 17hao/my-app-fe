import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { Link } from "react-router-dom"

export default function NaiveNavbar() {
    const navbarStyle = {
        height: "55px",
        backgroundColor: "#0f0f0f"
    }

    const linkStyle = {
        display: "inline-block",
        paddingTop: "13px",
        paddingLeft: "30px",
        color: "#fcfcfc",
        fontSize: "23px",
        textDecoration: "none",
    }

    const linkMap = new Map()
    linkMap.set("/", "Home")
    linkMap.set("/blog", "Blog")
    linkMap.set("/about", "About")
    linkMap.set("/lab", "Lab")

    const links = (
        Array.from(linkMap).map(([k, v]) =>
            (<Link to={k} style={linkStyle} key={k}>{v}</Link>)
        )
    )

    const navItemsStyle = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    }

    return (
        <Navbar>
            <Nav style={navbarStyle}>
                <div style={navItemsStyle}>
                    {links}
                </div>
            </Nav>
        </Navbar>
    )
}