import axios from 'axios';
import { tokenManager } from '@/features/auth/utils/tokenManager';
import { authService } from '@/features/auth/services/authService';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add token to headers
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

// Response interceptor - Handle token refresh
let isRefreshing = false;
const failedQueue: Array<{
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue.length = 0;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only try to refresh token if:
        // 1. Got 401 error
        // 2. Request was already sent with a token (user was logged in)
        // 3. Not already retrying
        // 4. Not an auth endpoint (login, register, etc)
        const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/signup') ||
            originalRequest.url?.includes('/auth/register');
        const hasToken = originalRequest.headers.Authorization;

        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            hasToken &&
            !isAuthEndpoint) {

            if (isRefreshing) {
                // Queue this request until token is refreshed
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
                const accessToken =
                    response.access_token || response.token || response.data?.access_token;

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
                // Don't redirect here - let the component handle it
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // For login/register errors, return the original error from BE
        return Promise.reject(error);
    },
);
