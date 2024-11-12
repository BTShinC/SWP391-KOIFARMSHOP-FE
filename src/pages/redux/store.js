// store.js
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import cartReducer from "./features/createSlice";
import buyNowReducer from "./features/buyNowSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartReducer,
    buyNow: buyNowReducer, // Thêm reducer mới
  },
});

export default store;
