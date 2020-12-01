import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import TestMd from './markdown/Test.md';

class Markdown extends Component {
    constructor() {
        super();
        this.state = {markdown: ''};
    }

    componentWillMount() {
        // Get the contents from the Markdown file and put them in the React state, so we can reference it in render() below.
        fetch(TestMd).then(res => res.text()).then(text => this.setState({ markdown: text }));
    }

    render() {
        const { markdown } = this.state;
        return <ReactMarkdown source={markdown} />;
    }
}

export default Markdown;