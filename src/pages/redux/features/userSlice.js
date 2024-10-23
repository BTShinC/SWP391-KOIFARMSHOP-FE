import { createSlice } from "@reduxjs/toolkit";

const initialState = null; // Trạng thái ban đầu là null

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => action.payload, // Cập nhật trạng thái người dùng
    logout: () => initialState,
    setUser: (state, action) => {
      return { 
        accountID: action.payload.accountId,
        fullName: action.payload.fullName, // Lưu fullName
        accountBalance: action.payload.accountBalance // Lưu accountBalance
      }; 
    },
  },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
