import React from "react";
import { Link } from "react-router-dom";
import { Descriptions, Tabs } from "antd";

import route from "./route";
const { TabPane } = Tabs;

class Home extends React.Component {
	render() {
		return (
			<div id="home">
				<a target="_blank" rel="noopener noreferrer" href="https://github.com/17hao">
					github
				</a>
				<div>email: sqh1107@gmail.com</div>

				<Tabs animated={false}>
					{route.map((v) => (
						<TabPane
							key={v.path}
							tab={
								<Link to={v.path} style={{ color: "black" }}>
									{v.tab}
								</Link>
							}
						></TabPane>
					))}
				</Tabs>
			</div>
		);
	}
}

export default Home;
