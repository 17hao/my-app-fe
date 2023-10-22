import React from 'react';
import { Link } from 'react-router-dom';
import './articals.css'

function Articals(props) {
    const links = props.articals.map(artical =>
        <div className="custom-link">
            <Link key={artical.path} to={artical.path} style={{ color: 'black' }}>
                <div>{artical.title}</div>
            </Link>
        </div>
    )

    return (
        <div id='articals'>
            {links}
        </div>
    )
}

export default Articals;
