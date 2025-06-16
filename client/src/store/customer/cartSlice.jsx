// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   userId: null,
//   items: [],
//   totalQuantity: 0,
//   totalPrice: 0,
//   status: "idle",
//   error: null,
// };

// const calcTotals = (state) => {
//   state.totalQuantity = state.items.reduce((s, i) => s + i.quantity, 0);
//   state.totalPrice = state.items.reduce((s, i) => s + i.quantity * i.price, 0);
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     setUser(state, { payload }) {
//       state.userId = payload;
//       if (!state.items.length) {
//         state.items = [];
//         state.totalQuantity = 0;
//         state.totalPrice = 0;
//       }
//     },
//     addItem(state, { payload }) {
//       const item = {
//         ...payload,
//         quantity: Number(payload.quantity) || 0,
//         price: Number(payload.price) || 0,
//       };
//       const existing = state.items.find((i) => i.productId === item.productId);
//       if (existing) {
//         existing.quantity += item.quantity;
//       } else {
//         state.items.push(item);
//       }
//       calcTotals(state);
//     },
//     removeItem(state, { payload }) {
//       state.items = state.items.filter((i) => i.productId !== payload);
//       calcTotals(state);
//     },
//     updateQuantity(state, { payload }) {
//       const item = state.items.find((i) => i.productId === payload.productId);
//       if (item) {
//         item.quantity = Math.max(1, payload.quantity);
//       }
//       calcTotals(state);
//     },
//     clearCart(state) {
//       state.items = [];
//       calcTotals(state);
//     },
//     syncCart(state, { payload }) {
//       state.items = payload.items || [];
//       state.totalQuantity = payload.totalQuantity || 0;
//       state.totalPrice = payload.totalPrice || 0;
//     },
//   },
// });

// export const { setUser, addItem, removeItem, updateQuantity, clearCart, syncCart } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

/**
 * State dạng:
 * {
 *   items: {
 *     userId1: [ { productId, quantity, price, ... } ],
 *     userId2: [ ... ]
 *   }
 * }
 */
const initialState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, { payload }) {
      const { userId, item } = payload;
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
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
