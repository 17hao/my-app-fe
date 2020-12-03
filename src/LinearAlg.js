import React, { Component } from 'react';
import linearAlg from './markdown/LinearAlg.md';
import MarkdownRender from './MarkdownRender';

class LinearAlgMd extends Component {
    constructor() {
        super();
        this.state = { markdown: '' };
    }

    componentWillMount() {
        // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
        fetch(linearAlg).then(res => res.text()).then(text => this.setState({ markdown: text }));
    }

    render() {
        const { markdown } = this.state;
        return <MarkdownRender source={markdown} />;
    }
}

export default LinearAlgMd;