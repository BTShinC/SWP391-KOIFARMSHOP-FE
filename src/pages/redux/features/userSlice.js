import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => action.payload,
    logout: () => initialState,
    setUser: (state, action) => {
      // Kiểm tra dữ liệu có được truyền vào đúng không trước khi thực hiện set dữ liệu
      state.accountID = action.payload.accountID;
      state.fullName = action.payload.fullName;
      state.accountBalance = action.payload.accountBalance;
      state.image = action.payload.image; 
      state.email = action.payload.email;  
      state.phoneNumber = action.payload.phoneNumber;
    },
  },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
