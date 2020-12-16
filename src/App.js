import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import TestMd from './TestMd';
import MathMd from './MathMd';
import Calculus from './CalculusNote';
import LinearAlgMd from './LinearAlg';
import MST from './Mst';
import InitShell from './InitSh';

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Home} />
                    {/* <Route path="/test.md" component={TestMd} />
                    <Route path="/math.md" component={MathMd} /> */}
                    <Route path="/calculus.md" component={Calculus} />
                    <Route path="/linearAlg.md" component={LinearAlgMd} />
                    <Route path="/mst.md" component={MST} />
					<Route path="/InitShell.md" component={InitShell} />
                </div>
            </Router>
        )
    }
}
export default App;
