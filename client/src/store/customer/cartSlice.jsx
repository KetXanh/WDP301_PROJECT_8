import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0
};

const calcTotals = (state) => {
  state.totalQuantity = state.items.reduce((s, i) => s + i.quantity, 0);
  state.totalPrice = state.items.reduce((s, i) => s + i.quantity * i.price, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, { payload }) {
      const item = {
        ...payload,
        quantity: Number(payload.quantity) || 0,
        price: Number(payload.price) || 0
      };
      const existing = state.items.find(i => i.productId === item.productId);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + item.quantity, existing.stock);
      } else {
        state.items.push(item);
      }
      calcTotals(state);
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter(i => i.productId !== payload);
      calcTotals(state);
    },
    updateQuantity(state, { payload }) {
      const item = state.items.find(i => i.productId === payload.productId);
      if (item) {
        item.quantity = Math.min(Math.max(1, payload.quantity), item.stock);
      }
      calcTotals(state);
    },
    clearCart(state) {
      state.items = [];
      calcTotals(state);
    }
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
