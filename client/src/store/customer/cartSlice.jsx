

import { createSlice } from "@reduxjs/toolkit";
import { GUEST_ID } from "./constans";
import { logout } from "./authSlice";

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
      if (!item?.productId) return;          // <‑‑ không có productId thì bỏ
      if (!Number.isInteger(item.quantity) || item.quantity < 1) item.quantity = 1;

      const list = state.items[userId] ?? [];
      const found = list.find(i => i.productId === item.productId);

      if (found) found.quantity = Math.min(found.quantity + item.quantity, 10);
      else list.push({ ...item });

      state.items[userId] = list;
    },

    removeFromCart(state, { payload }) {
      const { userId = GUEST_ID, productId } = payload;
      if (state.items[userId])
        state.items[userId] = state.items[userId].filter(
          (i) => i.productId !== productId
        );
    },

    clearCart(state, { payload }) {
      const { userId = GUEST_ID } = payload;
      if (state.items[userId]) state.items[userId] = [];
    },
    removePurchasedItems(state, { payload }) {
      const { userId = GUEST_ID, purchasedIds } = payload;
      if (!state.items[userId]) return;

      state.items[userId] = state.items[userId].filter(
        (item) => !purchasedIds.includes(item.productId || item.product)
      );
    },

    increaseQuantity(state, { payload }) {
      const { userId = GUEST_ID, productId } = payload;
      const item = state.items[userId]?.find((i) => i.productId === productId);
      if (item && item.quantity < 10) item.quantity += 1;
    },

    decreaseQuantity(state, { payload }) {
      const { userId = GUEST_ID, productId } = payload;
      const item = state.items[userId]?.find((i) => i.productId === productId);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    mergeGuestCart(state, { payload }) {
      const { userId, guestItems } = payload;
      if (!userId || !guestItems) return;

      if (!state.items[userId]) state.items[userId] = [];

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

      delete state.items[GUEST_ID];
    },
    setCartFromServer(state, { payload }) {
      const { userId, items } = payload;
      state.items[userId] = items;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.items[GUEST_ID] = [];
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  mergeGuestCart,
  setCartFromServer,
  removePurchasedItems
} = cartSlice.actions;
export default cartSlice.reducer;
