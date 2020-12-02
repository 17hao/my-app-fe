import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import mathMd from './markdown/Math.md';
import Markdown from './MarkdownRender';

class MathMd extends Component {
    constructor() {
        super();
        this.state = { markdown: '' };
    }

    componentWillMount() {
        // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
        fetch(mathMd).then(res => res.text()).then(text => this.setState({ markdown: text }));
    }

    render() {
        const { markdown } = this.state;
        return <ReactMarkdown source={markdown} renderers={{ text: Markdown }} />;
    }
}

export default MathMd;