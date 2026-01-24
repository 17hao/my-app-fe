import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import emoji from "emoji-dictionary";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

import "katex/dist/katex.min.css";

interface CodeBlockProps {
    children?: React.ReactNode;
    className?: string;
    node?: any;
    [key: string]: any;
}

function CodeBlock(props: CodeBlockProps): React.ReactElement {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const lang = match ? match[1] : "plaintext";
    const newChildren = String(children).replace(/\n$/, "").replace(/\t/g, '    ');
    return (
        <SyntaxHighlighter
            {...rest}
            children={newChildren}
            language={lang}
            showLineNumbers={true}
            style={vs}
        />
    );
}

interface MarkdownRenderProps {
    title: string;
    markdown: string;
}

export default function MarkdownRender({ title, markdown }: MarkdownRenderProps): React.ReactElement {
    // 设置页面标题
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div className="markdownRender">
            <ReactMarkdown
                children={markdown}
                remarkPlugins={[
                    RemarkMathPlugin,
                    remarkGfm,
                    [remarkToc, { heading: "Table of Contents", tight: true }]
                ]}
                rehypePlugins={[
                    [rehypeKatex, { strict: false }],
                    rehypeSlug
                ]}
                components={{
                    text: (text: any) => text.value.replace(/:\w+:/gi, (name: string) => emoji.getUnicode(name)),
                    code: CodeBlock,
                }}
            />
        </div>
    );
}
