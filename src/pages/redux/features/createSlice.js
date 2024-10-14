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
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.productID === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    setCartItems: (state, action) => {
      state.items = action.payload; // Cập nhật danh sách sản phẩm trong giỏ hàng
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
