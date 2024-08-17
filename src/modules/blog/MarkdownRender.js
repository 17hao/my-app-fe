import ReactMarkdown from "react-markdown"
import RemarkMathPlugin from "remark-math"
import emoji from "emoji-dictionary"
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"
import { useLayoutEffect, useState } from "react"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { useParams } from "react-router-dom"
import { loadBlog } from "modules/blog/BlogLoader";

import "katex/dist/katex.min.css"
import "modules/blog/MarkdownRender.css"

function CodeBlock(props) {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
        return (
            <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                showLineNumbers={true}
                style={github}
            />
        )
    };

    return (
        <code {...rest}>
            {children}
        </code>
    );
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
