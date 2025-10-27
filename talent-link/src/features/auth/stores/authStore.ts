import { create } from 'zustand';
import type { User } from '../types';
import { tokenManager } from '../utils/tokenManager';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setAuth: (user: User | null) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => set({ user }),

    setAuth: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
        }),

    clearAuth: () => {
        tokenManager.clearTokens();
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },

    setLoading: (loading) => set({ isLoading: loading }),

    checkAuth: async () => {
        const hasTokens = tokenManager.hasTokens();
        if (!hasTokens) {
            set({ isAuthenticated: false, isLoading: false });
            return;
        }
        set({ isLoading: true });
        // This will be called by initAuth in useAuth hook
    },
}));
