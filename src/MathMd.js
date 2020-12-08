import React, { Component } from 'react';
import mathMd from './markdown/Math.md';
import MarkdownRender from './MarkdownRender';

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
        return <MarkdownRender source={markdown} />;
    }
}

export default MathMd;