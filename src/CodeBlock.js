import React from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function CodeBlock(props) {
    const { language, value } = props
    return (
        <SyntaxHighlighter language={language} style={docco}>
            {value}
        </SyntaxHighlighter>
    );
}

export default CodeBlock