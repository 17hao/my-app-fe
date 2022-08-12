import React from 'react';
import { Link } from 'react-router-dom';

function Home(props) {
    const links = props.docs.map(doc =>
        <Link key={doc.path} to={doc.path} style={{ color: 'black' }}>
            <div>{doc.title}</div>
        </Link>
    )

    return (
        <div id='home'>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/17hao">github</a>
            <div>email: sqh1107@gmail.com</div>
            {links}
        </div>
    )
}

export default Home;
