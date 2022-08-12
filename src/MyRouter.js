import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import initECS from './markdown/InitECS.md';
import mst from './markdown/MST.md';
import MarkdownRender from './MarkdownRender';
import linearAlg from './markdown/LinearAlg.md';
import charSet from './markdown/CharSet.md';
import calculus from './markdown/Calculus.md';



function MyRouter(props) {
    const docs = [
        {
            "path": "/CharSet",
            "title": "字符编码",
            "file": charSet,
        },
        {
            "path": "/Calculus",
            "title": "微积分笔记",
            "file": calculus,
        },
        {
            "path": "/LineaerAlg",
            "title": "线性代数笔记",
            "file": linearAlg,
        },
        {
            "path": "/MST",
            "title": "最小生成树",
            "file": mst,
        },
        {
            "path": "/InitECS",
            "title": "云服务器部署脚本",
            "file": initECS,
        }
    ]


    const routes = (
        docs.map(doc =>
            <Route key={doc.path} path={doc.path} render={() => <MarkdownRender file={doc.file} />} />
        )
    )
    return (
        <Router>
            <div>
                <Route exact path="/" render={() => <Home docs={docs} />} />
                {routes}
            </div>
        </Router>
    )
}

export default MyRouter;
