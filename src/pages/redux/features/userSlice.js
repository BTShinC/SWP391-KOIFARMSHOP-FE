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
        accountId: action.payload.accountId,
        fullName: action.payload.fullName, // Lưu fullName
        accountBalance: action.payload.accountBalance,// Lưu accountBalance
        image: action.payload.image,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber, 
        }; 
    },
  },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
