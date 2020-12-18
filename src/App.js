import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Calculus from "./CalculusNote";
import Header from "./Header";
import route from "./route";

class App extends React.Component {
	render() {
		return (
			<div>
				{/* <MyNavbar /> */}
				<Router>
					<Header />
					<Route exact path="/" component={Calculus} />
					{route.map((v) => (
						<Route path={v.path} component={v.component} />
					))}
				</Router>
			</div>
		);
	}
}
export default App;
