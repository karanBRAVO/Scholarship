import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  token: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminData: (state, action) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    resetAdminData: (state, action) => {
      state.username = "";
      state.token = "";
    },
  },
});

export const { setAdminData, resetAdminData } = adminSlice.actions;

export default adminSlice.reducer;
