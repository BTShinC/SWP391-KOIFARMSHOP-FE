import { createSlice } from "@reduxjs/toolkit";

const initialState = null; // Trạng thái ban đầu là null

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => action.payload,
    logout: () => initialState,
    setUser: (state, action) => {
      return { accountId: action.payload.accountId }; // Cập nhật tài khoản người dùng
    },
  },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
