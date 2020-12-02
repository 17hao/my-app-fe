import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return <div id="home">
            <div>Hello, World!</div>
            <div>
                <Link to="/md" style={{ color: 'black' }}>
                    <div>jump to md</div>
                </Link>
            </div>
        </div>;
    }
}

export default Home;