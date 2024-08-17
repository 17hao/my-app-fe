import ReactMarkdown from "react-markdown"
import RemarkMathPlugin from "remark-math"
import emoji from "emoji-dictionary"
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"
import { useLayoutEffect, useState } from "react"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams } from "react-router-dom"
import { loadBlog } from "modules/blog/BlogLoader";

import "katex/dist/katex.min.css"
import "modules/blog/MarkdownRender.css"

function CodeBlock(props) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const lang = match ? match[1] : "plaintext";
    return (
        <SyntaxHighlighter
            {...rest}
            children={String(children).replace(/\n$/, "")}
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
        setMd(loadBlog(params.path));
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
