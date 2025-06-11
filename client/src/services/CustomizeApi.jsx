import axios from "axios";
import { store } from '../store/store.jsx';
import { logout, login } from '../store/customer/authSlice.jsx';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

instance.interceptors.request.use(
    (config) => {
        const token = store.getState().customer?.accessToken;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu đã retry rồi thì không retry nữa (tránh vòng lặp vô tận)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const state = store.getState();
            const refreshToken = state.customer?.refreshToken;

            if (!refreshToken) {
                store.dispatch(logout());
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return instance(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const res = await axios.post('http://localhost:3000/api/auth/refresh-token', {
                    refreshToken: refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = res.data;

                store.dispatch(login({ accessToken, refreshToken: newRefreshToken }));

                processQueue(null, accessToken);

                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                return instance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                store.dispatch(logout());
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
