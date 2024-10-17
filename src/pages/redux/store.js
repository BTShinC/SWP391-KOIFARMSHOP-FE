// store.js
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import cartReducer from "./features/createSlice";


export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartReducer,
  },
});

export default store;
