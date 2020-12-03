import React, { Component } from 'react';
import calculus from './markdown/Calculus.md';
import MarkdownRender from './MarkdownRender';

class CalculusMd extends Component {
    constructor() {
        super();
        this.state = { markdown: '' };
    }

    componentWillMount() {
        // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
        fetch(calculus).then(res => res.text()).then(text => this.setState({ markdown: text }));
    }

    render() {
        const { markdown } = this.state;
        return <MarkdownRender source={markdown} />;
    }
}

export default CalculusMd;