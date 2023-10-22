import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './naive-navbar.css'

class NaiveNavbar extends React.Component {
    render() {
        return (
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Nav>
                        <Nav.Link href="/" className="custom-link">Home</Nav.Link>
                        <Nav.Link href="/articals" className="custom-link">Articals</Nav.Link>
                        <Nav.Link href="/aboutme" className="custom-link">About</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default NaiveNavbar;