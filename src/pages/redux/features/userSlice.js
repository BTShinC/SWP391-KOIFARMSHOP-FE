import { createSlice } from "@reduxjs/toolkit";

const initialState = null; // Trạng thái ban đầu là null

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => action.payload,
    logout: () => initialState,
    setUser: (state, action) => {
      state.accountID = action.payload.accountID;
      state.fullName = action.payload.fullName;
      state.accountBalance = action.payload.accountBalance;
      state.image = action.payload.image;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.address = action.payload.address;
      state.roleName = action.payload.roleName;
    },
  },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
