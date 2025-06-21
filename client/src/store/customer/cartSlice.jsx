

import { createSlice } from "@reduxjs/toolkit";
import { GUEST_ID } from "./constans";


const initialState = {
  items: {
    [GUEST_ID]: [],
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, { payload }) {
      const { userId = GUEST_ID, item } = payload;
      if (!state.items[userId]) {
        state.items = {
          ...state.items,
          [userId]: [],
        };
      }

      const existing = state.items[userId].find(
        (i) => i.productId === item.productId
      );

      if (existing) {
        existing.quantity = Math.min(existing.quantity + (item.quantity || 1), 10);
      } else {
        state.items[userId].push({
          ...item,
          quantity: Math.min(item.quantity || 1, 10),
          originalPrice: item.originalPrice ?? item.price,
          isSale: item.isSale ?? false,
        });
      }
    },

    removeFromCart(state, { payload }) {
      const { userId, productId } = payload;
      if (state.items[userId])
        state.items[userId] = state.items[userId].filter(
          (i) => i.productId !== productId
        );
    },

    clearCart(state, { payload }) {
      const { userId } = payload;
      if (state.items[userId]) state.items[userId] = [];
    },

    increaseQuantity(state, { payload }) {
      const { userId, productId } = payload;
      const item = state.items[userId]?.find((i) => i.productId === productId);
      if (item && item.quantity < 10) item.quantity += 1;
    },

    decreaseQuantity(state, { payload }) {
      const { userId, productId } = payload;
      const item = state.items[userId]?.find((i) => i.productId === productId);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    mergeGuestCart(state, { payload }) {
      const { userId } = payload;
      if (!userId) return;

      if (!state.items[userId]) state.items[userId] = [];

      const guestItems = state.items[GUEST_ID] || [];

      guestItems.forEach((gItem) => {
        const existing = state.items[userId].find(
          (uItem) => uItem.productId === gItem.productId
        );
        if (existing) {
          existing.quantity = Math.min(existing.quantity + gItem.quantity, 10);
        } else {
          state.items[userId].push({ ...gItem });
        }
      });

      state.items[GUEST_ID] = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  mergeGuestCart,
} = cartSlice.actions;
export default cartSlice.reducer;
