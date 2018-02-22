import { combineReducers } from "redux";
import dataReducer from "./dataReducer";
import mapReducer from "./mapReducer";

export default combineReducers({
  data: dataReducer,
  map: mapReducer
});
