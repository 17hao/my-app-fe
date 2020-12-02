import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import TestMd from './TestMd';
import MathMd from './MathMd'
class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/test.md" component={TestMd} />
                    <Route path="/math.md" component={MathMd} />
                </div>
            </Router>
        )
    }
}
export default App;