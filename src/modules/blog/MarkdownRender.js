import ReactMarkdown from "react-markdown"
import RemarkMathPlugin from "remark-math"
import emoji from "emoji-dictionary"
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"
import { useEffect, useLayoutEffect, useState } from "react"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams } from "react-router-dom"

import "katex/dist/katex.min.css"
import "modules/blog/MarkdownRender.css"
import { pathToTitle } from "./common"

function CodeBlock(props) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const lang = match ? match[1] : "plaintext";
    // gofmt uses tabs for indentation and blanks for alignment
    const newChildren = String(children).replace(/\n$/, "").replace(/\t/g, '    ');
    return (
        <SyntaxHighlighter
            {...rest}
            children={newChildren}
            language={lang}
            showLineNumbers={true}
            style={vs}
        />
    )
}

export function MarkdownRender() {
    const params = useParams();
    const [md, setMd] = useState("markdown");

    useLayoutEffect(() => {
        const loadBlog = async (path) => {
            try {
                const response = await fetch(
                    `https://obj-storage-1304785445.shiqihao.xyz/blog/${path}.md`
                );
                const body = await response.text();
                setMd(body);
            } catch (e) {
                console.error(e);
            }
        };

        loadBlog(params.path);
    }, [params.path]);

    useEffect(() => {
        let title = params.path;
        if (pathToTitle.has(params.path)) {
            title = pathToTitle.get(params.path);
        }
        document.title = title;
    }, [params.path]);


    const newProps = {
        remarkPlugins: [
            RemarkMathPlugin,
            remarkGfm,
            [remarkToc, { heading: "Table of Contents", tight: true }]
        ],
        rehypePlugins: [
            [rehypeKatex, { strict: false }],
            rehypeSlug
        ],
        components: {
            text: text => text.value.replace(/:\w+:/gi, name => emoji.getUnicode(name)),
            code: CodeBlock,
        },
        children: md,
    };

    return (
        <div className="markdownRender">
            <ReactMarkdown {...newProps} />
        </div>
    );
}
