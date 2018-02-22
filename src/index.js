import React from "react";
import ReactDOM from "react-dom";
//Import Redux
import { Provider } from "react-redux";
//Get Core App
import App from "./components/App";
//Get the Redux Store
import store from "./store";
import "./index.css";

//Render the App, wrapped in our data layer, at div id = root
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
