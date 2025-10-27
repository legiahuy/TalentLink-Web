import { useAuthStore } from '../stores/authStore';

export const tokenManager = {
    getAccessToken: () => {
        return useAuthStore.getState().accessToken;
    },

    getRefreshToken: () => {
        return useAuthStore.getState().refreshToken;
    },

    setAccessToken: (token: string) => {
        useAuthStore.getState().setAccessToken(token);
    },

    setRefreshToken: (token: string) => {
        useAuthStore.getState().setRefreshToken(token);
    },

    clearTokens: () => {
        useAuthStore.getState().clearAuth();
    },
};
