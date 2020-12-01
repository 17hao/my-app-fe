import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home.js';
import Markdown from './Md.js';

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route path="/" component={Home} />
                    <Route path="/md" component={Markdown} />
                </div>
            </Router>
        )
    }
}
export default App;