import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  registeredAt: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.mobileNumber = action.payload.mobileNumber;
      state.registeredAt = action.payload.registeredAt;
      state.token = action.payload.token;
    },
    resetUserData: (state, action) => {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.mobileNumber = "";
      state.registeredAt = "";
      state.token = "";
    },
  },
});

export const { setUserData, resetUserData } = userSlice.actions;

export default userSlice.reducer;
