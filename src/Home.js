import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return <div id="home">
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/17hao">github</a>
            <div>email: sqh1107@gmail.com</div>
            <div>
                <Link to="/charSet.md" style={{ color: 'black' }}>
                    <div>字符编码</div>
                </Link>
                <Link to="/calculus.md" style={{ color: 'black' }}>
                    <div>微积分笔记</div>
                </Link>
                <Link to="/linearAlg.md" style={{ color: 'black' }}>
                    <div>线代笔记</div>
                </Link>
                <Link to="/mst.md" style={{ color: 'black' }}>
                    <div>最小生成树</div>
                </Link>
                <Link to="/InitShell.md" style={{ color: 'black' }}>
                    <div>迅速部署阿里云服务器</div>
                </Link>
            </div>
        </div>;
    }
}

export default Home;
