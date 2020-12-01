import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return <div>
            <div>This is Home!</div>
            <div>
                <Link to="/md" style={{ color: 'black' }}>
                    <div>点击跳转到md</div>
                </Link>
            </div>
        </div>;
    }
}

export default Home;