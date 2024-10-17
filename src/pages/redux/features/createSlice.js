import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.productID === action.payload.productID);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productID !== action.payload);
    },  

    setCartItems: (state, action) => {
      state.items = action.payload; // Cập nhật giỏ hàng với thông tin mới
    },
  },
});

export const {addToCart, setCartItems, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
