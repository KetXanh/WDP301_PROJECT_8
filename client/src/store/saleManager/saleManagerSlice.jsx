import { createSlice } from "@reduxjs/toolkit";

const saleManagerSlice = createSlice({
  name: "saleManager",
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    // Thêm các state khác nếu cần
    tasks: [],
    kpis: [],
    discounts: [],
    statistics: null,
  },
  reducers: {
    // Auth actions
    setUser(state, action) {
      state.user = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },

    // Loading & Error actions
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },

    // Tasks actions
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    addTask(state, action) {
      state.tasks.push(action.payload);
    },
    updateTask(state, action) {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },

    // KPI actions
    setKPIs(state, action) {
      state.kpis = action.payload;
    },
    addKPI(state, action) {
      state.kpis.push(action.payload);
    },
    updateKPI(state, action) {
      const index = state.kpis.findIndex(kpi => kpi.id === action.payload.id);
      if (index !== -1) {
        state.kpis[index] = action.payload;
      }
    },
    deleteKPI(state, action) {
      state.kpis = state.kpis.filter(kpi => kpi.id !== action.payload);
    },

    // Discount actions
    setDiscounts(state, action) {
      state.discounts = action.payload;
    },
    addDiscount(state, action) {
      state.discounts.push(action.payload);
    },
    updateDiscount(state, action) {
      const index = state.discounts.findIndex(discount => discount.id === action.payload.id);
      if (index !== -1) {
        state.discounts[index] = action.payload;
      }
    },
    deleteDiscount(state, action) {
      state.discounts = state.discounts.filter(discount => discount.id !== action.payload);
    },

    // Statistics actions
    setStatistics(state, action) {
      state.statistics = action.payload;
    },
  },
});

export const {
  // Auth actions
  setUser,
  setAccessToken,
  logout,

  // Loading & Error actions
  setLoading,
  setError,

  // Tasks actions
  setTasks,
  addTask,
  updateTask,
  deleteTask,

  // KPI actions
  setKPIs,
  addKPI,
  updateKPI,
  deleteKPI,

  // Discount actions
  setDiscounts,
  addDiscount,
  updateDiscount,
  deleteDiscount,

  // Statistics actions
  setStatistics,
} = saleManagerSlice.actions;

export default saleManagerSlice.reducer; 