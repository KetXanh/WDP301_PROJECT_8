import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // dùng localStorage
import { combineReducers } from 'redux';
import userReducer from './customer/authSlice';

// Cấu hình persist
const persistConfig = {
    key: 'root',
    storage,
};

// Combine reducers nếu có nhiều slice
const rootReducer = combineReducers({
    customer: userReducer,
    // thêm các slice khác ở đây
});

// Tạo reducer có persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // cần thiết để tránh lỗi với redux-persist
        }),
});

// Tạo persistor
export const persistor = persistStore(store);
