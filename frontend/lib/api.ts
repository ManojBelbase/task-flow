import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !(originalRequest as any)._retry) {
            (originalRequest as any)._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {
                    refreshToken
                });

                // Update tokens
                const { user } = useAuthStore.getState();
                if (user) {
                    useAuthStore.getState().setAuth(user, data.accessToken, data.refreshToken);
                }

                // Update header and retry
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
