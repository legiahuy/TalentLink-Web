import axios from 'axios';
import { tokenManager } from '@/features/auth/utils/tokenManager';
import { authService } from '@/features/auth/services/authService';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // Removed withCredentials: true since backend uses Bearer token, not cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor
let isRefreshing = false;
type FailedPromise = {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
};
let failedQueue: FailedPromise[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = tokenManager.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await authService.refreshToken(refreshToken);
                const accessToken = response.accessToken || response.token;

                if (accessToken) {
                    tokenManager.setAccessToken(accessToken);
                    processQueue(null, accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    throw new Error('No access token in refresh response');
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenManager.clearTokens();
                // Don't redirect automatically, let the app handle it
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);
