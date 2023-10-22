import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Homepage from './hoempage';
import Articals from './articals';
import AboutMe from './about-me';
import initCloudServer from './md_files/init_cloud_server.md';
import mst from './md_files/mst.md';
import MarkdownRender from './markdown-render.js';
import linearAlg from './md_files/linear_alg.md';
import charset from './md_files/charset.md';
import calculus from './md_files/calculus.md';

function NaiveRouter(props) {
    const articals = [
        {
            "path": "/charset",
            "title": "字符编码",
            "file": charset,
        },
        {
            "path": "/calculus",
            "title": "微积分笔记",
            "file": calculus,
        },
        {
            "path": "/lineaer_alg",
            "title": "线性代数笔记",
            "file": linearAlg,
        },
        {
            "path": "/mst",
            "title": "最小生成树",
            "file": mst,
        },
        {
            "path": "/init_cloud_server",
            "title": "云服务器部署脚本",
            "file": initCloudServer,
        }
    ]


    const routes = (
        articals.map(artical =>
            <Route key={artical.path} path={artical.path} render={() => <MarkdownRender file={artical.file} />} />
        )
    )
    return (
        <BrowserRouter>
            <div>
                <Route exact path="/" render={() => <Homepage />} />
                <Route exact path="/articals" render={() => <Articals articals={articals} />} />
                <Route exact path="/aboutme" render={() => <AboutMe />} />
                {routes}
            </div>
        </BrowserRouter>
    )
}

export default NaiveRouter;
