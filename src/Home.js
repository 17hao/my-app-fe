import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return <div id="home">
            <div>Hello, World!</div>
            <div>
                <Link to="/calculus.md" style={{ color: 'black' }}>
                    <div>微积分笔记</div>
                </Link>
                <Link to="/linearAlg.md" style={{ color: 'black' }}>
                    <div>线代笔记</div>
                </Link>
                <Link to="/mst.md" style={{ color: 'black' }}>
                    <div>最小生成树</div>
                </Link>
            </div>
        </div>;
    }
}

export default Home;