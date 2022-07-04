import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from './app/store'

let app = document.getElementById('app') as HTMLElement
ReactDOM.render(
	<React.StrictMode>
		{/* <Provider store={store}> */}
			<App />
		{/* </Provider> */}
	</React.StrictMode>
,app);
