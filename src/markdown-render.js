import ReactMarkdown from 'react-markdown'
import RemarkMathPlugin from 'remark-math'
import emoji from 'emoji-dictionary'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import React from 'react'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import 'katex/dist/katex.min.css'
import './markdown-render.css'

function CodeBlock(props) {
    const { children, className, node, ...rest } = props
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
        <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            showLineNumbers={true}
            style={atomOneLight}
        />
    ) : (
        <code {...rest} className={className} style={{ backgroundColor: "#f1f1f1" }}>
            {children}
        </code>
    )
}

export default class MarkdownRender extends React.Component {
    constructor() {
        super()
        this.state = { markdown: '' }
    }

    componentDidMount() {
        fetch(this.props.content).then(res => res.text()).then(text => this.setState({ markdown: text }));
    }

    render() {
        const newProps = {
            ...this.props,
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
            children: this.state.markdown,
        };

        return (
            <div className="markdown-render">
                <ReactMarkdown {...newProps} />
            </div>
        );
    }
}
