import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return <div id="home">
            <div>Hello, World!</div>
            <div>
                <Link to="/test.md" style={{ color: 'black' }}>
                    <div>Test.md</div>
                </Link>
            </div>
            <div>
                <Link to="/math.md" style={{ color: 'black' }}>
                    <div>Math.md</div>
                </Link>
            </div>
        </div>;
    }
}

export default Home;