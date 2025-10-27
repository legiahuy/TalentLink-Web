import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterData } from '../types';
import { useCallback } from 'react';
import { tokenManager } from '../utils/tokenManager';

// Helper function to extract meaningful error message
const extractErrorMessage = (
    error: unknown,
    defaultMessage: string,
): string => {
    if (error instanceof Error && 'response' in error) {
        const axiosError = error as Error & {
            response?: { data?: { error?: string; message?: string } };
        };
        return (
            axiosError.response?.data?.error ||
            axiosError.response?.data?.message ||
            error.message
        );
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

export const useAuth = () => {
    const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } =
        useAuthStore();

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);

            // Extract tokens from response
            const accessToken =
                response.access_token || response.data?.access_token || response.accessToken;
            const refreshToken =
                response.refresh_token || response.data?.refresh_token || response.refreshToken;

            if (!accessToken || !refreshToken) {
                throw new Error('Invalid response from server - missing tokens');
            }

            // Save tokens to localStorage
            tokenManager.setTokens(accessToken, refreshToken);

            // Get user info
            try {
                const user = await authService.getMe();
                setAuth(user);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                throw error;
            }
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Đăng nhập thất bại');
            throw new Error(errorMessage);
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            const response = await authService.register(userData);

            // Extract tokens from response
            const accessToken =
                response.access_token || response.data?.access_token || response.accessToken;
            const refreshToken =
                response.refresh_token || response.data?.refresh_token || response.refreshToken;

            if (!accessToken || !refreshToken) {
                throw new Error('Invalid response from server - missing tokens');
            }

            // Save tokens to localStorage
            tokenManager.setTokens(accessToken, refreshToken);

            // Get user info
            try {
                const user = await authService.getMe();
                setAuth(user);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                throw error;
            }
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Đăng ký thất bại');
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        try {
            const refreshToken = tokenManager.getRefreshToken();
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
        }
    };

    const initAuth = useCallback(async () => {
        const hasTokens = tokenManager.hasTokens();
        if (!hasTokens) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const user = await authService.getMe();
            setAuth(user);
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, [setAuth, clearAuth, setLoading]);

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        initAuth,
    };
};
