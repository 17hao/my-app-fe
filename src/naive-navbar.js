import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './naive-navbar.css'

class NaiveNavbar extends React.Component {
    render() {
        return (
            <Navbar bg="dark" data-bs-theme="dark">
                <Nav>
                    <Nav.Link href="/" className="custom-nav">Home</Nav.Link>
                    <Nav.Link href="/articals" className="custom-nav">Articals</Nav.Link>
                    <Nav.Link href="/aboutme" className="custom-nav">About</Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}

export default NaiveNavbar;