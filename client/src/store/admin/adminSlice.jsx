// store/admin/adminSlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboardData: null,
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    setDashboardData(state, action) {
      state.dashboardData = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setDashboardData, setProducts, setLoading, setError } =
  adminSlice.actions;
export default adminSlice.reducer;
