import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: "",
    refreshToken: "",
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }


    },
});

export const { login, logout } = customerSlice.actions;

export default customerSlice.reducer;
