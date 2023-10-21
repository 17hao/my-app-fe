import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

class MyNavbar extends React.Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">返回首页</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default MyNavbar;