import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice.js";
import userAnsSlice from "./features/userAns.js";
import adminSlice from "./features/adminSlice.js";

const rootReducer = combineReducers({
  login: loginSlice,
  userAns: userAnsSlice,
  admin: adminSlice,
});

export default rootReducer;
