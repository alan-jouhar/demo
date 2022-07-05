import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./app/store";

let app = document.getElementById("app") as HTMLElement;
ReactDOM.render(
	<App />,
	app
);
