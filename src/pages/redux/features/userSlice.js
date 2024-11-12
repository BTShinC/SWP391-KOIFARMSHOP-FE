import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => action.payload,
    logout: () => initialState,
    setUser: (state, action) => {

      return {
        accountID: action.payload.accountId,
        fullName: action.payload.fullName, // Lưu fullName
        accountBalance: action.payload.accountBalance, // Lưu accountBalance
        image: action.payload.image,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber,
        address: action.payload.address,
        roleName: action.payload.roleName,
      };


    },
  },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
