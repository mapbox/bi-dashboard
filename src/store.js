import { applyMiddleware, createStore } from "redux";
//This is the chrome devtools - it will get installed with npm install, but you'll want the chrome extension too
import { composeWithDevTools } from "redux-devtools-extension";
import promise from "redux-promise-middleware";
import reducer from "./reducers";

//This middleware allows us to track the AJAX more elegantly.
const middleware = applyMiddleware(promise());

//Build the store
export default createStore(reducer, composeWithDevTools(middleware));
