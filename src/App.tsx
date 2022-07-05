import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav/Nav";
import Main from "./pages/Main"
import About from "./pages/About"
const App: React.FC = (props) => {
	return (
		<BrowserRouter>
			<div>
				<Nav
					pages={[
						{ name: "home", path: "/" },
						{ name: "about", path: "/about" },
					]}
				/>
				<Switch>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/">
						<Main />
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
};

export default App;
