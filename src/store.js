// store.js
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./pages/redux/userSlice";


export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export default store;
