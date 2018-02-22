import { combineReducers } from "redux";
import dataReducer from "./dataReducer";
import mapReducer from "./mapReducer";

//Bring together all the reducers and create state tree branches
//state.data and state.map
export default combineReducers({
  data: dataReducer,
  map: mapReducer
});
