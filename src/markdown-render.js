import ReactMarkdown from 'react-markdown';
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';
import emoji from 'emoji-dictionary';
import CodeBlock from './code-block';
import gfm from 'remark-gfm';
import React from 'react';

class MarkdownRender extends React.Component {
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
            plugins: [
                RemarkMathPlugin,
                gfm,
            ],
            renderers: {
                ...{
                    text: text => text.value.replace(/:\w+:/gi, name => emoji.getUnicode(name)),
                    code: CodeBlock,
                },
                math: (props) =>
                    <MathJax.Node formula={props.value} />,
                inlineMath: (props) =>
                    <MathJax.Node inline formula={props.value} />,
            },
            source: this.state.markdown,
        };
        return (
            <MathJax.Provider input="tex">
                <ReactMarkdown {...newProps} />
            </MathJax.Provider>
        );
    }
}

export default MarkdownRender