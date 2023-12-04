import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice.js";
import userAnsSlice from "./features/userAns.js";

const rootReducer = combineReducers({
  login: loginSlice,
  userAns: userAnsSlice,
});

export default rootReducer;
