import { axiosInstance } from '@/lib/axios';
import type { LoginCredentials, RegisterData, User } from '../types';

export const authService = {
    async login(credentials: LoginCredentials) {
        console.log('🔥 authService.login called with:', credentials);
        console.log('🔥 Making POST request to /auth/login...');
        const { data } = await axiosInstance.post('/auth/login', credentials);
        console.log('🔥 Got data from /auth/login:', data);
        return data; // Returns tokens and user info
    },

    async register(userData: RegisterData) {
        console.log('userData', userData);
        const { data } = await axiosInstance.post('/auth/signup', userData);
        return data; // Returns tokens and user info (201 status)
    },

    async logout(refreshToken: string) {
        // Logout requires refresh token in body according to Swagger
        await axiosInstance.post('/auth/logout', {
            refresh_token: refreshToken,
        });
    },

    async refreshToken(refreshToken: string) {
        // Refresh requires refresh token in body according to Swagger
        const { data } = await axiosInstance.post('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return data; // Returns new access token
    },

    async getMe(): Promise<User> {
        // Requires Bearer token in Authorization header
        const { data } = await axiosInstance.get('/users/me');
        return data;
    },
};
