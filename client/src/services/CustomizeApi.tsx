import axios from "axios";
// @ts-ignore
import { store } from '../store/store.jsx';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
});

instance.interceptors.request.use(
    (config) => {
        const token = store.getState().user?.user?.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Tùy ý: dispatch logout, redirect, v.v.
        }
        return Promise.reject(error);
    }
);

export default instance;
