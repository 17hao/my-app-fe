import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'

import './naive-navbar.css'

export default class NaiveNavbar extends React.Component {
    render() {
        return (
            <Navbar bg="dark" data-bs-theme="dark">
                <Nav>
                    <Link to="/" className="custom-nav">Home</Link>
                    <Link to="/blog" className="custom-nav">Blog</Link>
                    <Link to="/about" className="custom-nav">About</Link>
                </Nav>
            </Navbar>
        );
    }
}
