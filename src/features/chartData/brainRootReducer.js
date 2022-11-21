import { combineReducers } from "redux";
//import bitcoinReducer from "./bitcoinReducer";
import brainReducer from "./brainReducer";
import brainReducer001 from "./brainReducer001";

const rootReducer = combineReducers({
  brain: brainReducer,
  brain001: brainReducer001,
})

export default rootReducer;