import { create } from 'zustand';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
    setAuth: (
        user: User | null,
        accessToken: string,
        refreshToken: string,
    ) => void;
    clearAuth: () => void;
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,

    setAuth: (user, accessToken, refreshToken) =>
        set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
        }),

    clearAuth: () =>
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
        }),

    setAccessToken: (token) => set({ accessToken: token }),
    setRefreshToken: (token) => set({ refreshToken: token }),

    setLoading: (loading) => set({ isLoading: loading }),
}));
