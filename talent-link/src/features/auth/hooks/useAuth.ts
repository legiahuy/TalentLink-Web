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
            response?: { data?: { error?: string } };
        };
        return axiosError.response?.data?.error || error.message;
    }
    return defaultMessage;
};

export const useAuth = () => {
    const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } =
        useAuthStore();
    const refreshToken = useAuthStore((state) => state.refreshToken);

    const login = async (credentials: LoginCredentials) => {
        console.log('🔥 Login started'); // Debug log
        try {
            console.log('🔥 Calling authService.login...'); // Debug log
            const response = await authService.login(credentials);
            console.log('🔥 Got response from authService.login', response); // Debug log

            // Get tokens from response
            const accessToken =
                response.access_token ||
                response.data?.access_token ||
                response.accessToken ||
                response.token;
            const refreshToken =
                response.refresh_token ||
                response.data?.refresh_token ||
                response.refreshToken;

            console.log('Res', response);
            console.log('login access', accessToken);
            console.log('login refresh', refreshToken);

            if (!accessToken || !refreshToken) {
                console.error('Invalid response structure:', response);
                throw new Error(
                    'Invalid response from server - missing tokens',
                );
            }

            // Set tokens first so getMe can use them
            setAuth(null, accessToken, refreshToken);

            // Get user info from /me endpoint
            try {
                const user = await authService.getMe();
                console.log('login user from /me', user);
                setAuth(user, accessToken, refreshToken);
            } catch (meError) {
                console.error('Failed to get user from /me:', meError);
                // Still keep tokens even if getMe fails
            }
        } catch (error) {
            console.log(error);
            const errorMessage = extractErrorMessage(
                error,
                'Đăng nhập thất bại',
            );
            throw new Error(errorMessage);
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            const response = await authService.register(userData);
            console.log('Register response:', response); // Debug log

            // Get tokens from response
            const accessToken =
                response.access_token ||
                response.data?.access_token ||
                response.accessToken ||
                response.token;
            const refreshToken =
                response.refresh_token ||
                response.data?.refresh_token ||
                response.refreshToken;

            console.log('register access', accessToken);
            console.log('register refresh', refreshToken);

            if (!accessToken || !refreshToken) {
                console.error('Invalid response structure:', response);
                throw new Error(
                    'Invalid response from server - missing tokens',
                );
            }

            // Set tokens first so getMe can use them
            setAuth(null, accessToken, refreshToken);

            // Get user info from /me endpoint
            try {
                const user = await authService.getMe();
                console.log('register user from /me', user);
                setAuth(user, accessToken, refreshToken);
            } catch (meError) {
                console.error('Failed to get user from /me:', meError);
                // Still keep tokens even if getMe fails
            }
        } catch (error) {
            console.log(error);
            const errorMessage = extractErrorMessage(error, 'Đăng ký thất bại');
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        try {
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } finally {
            clearAuth();
        }
    };

    const initAuth = useCallback(async () => {
        try {
            setLoading(true);
            const user = await authService.getMe();
            // For Bearer token auth, get existing tokens from store
            const accessToken = tokenManager.getAccessToken() || '';
            const refreshToken = tokenManager.getRefreshToken() || '';
            setAuth(user, accessToken, refreshToken);
        } catch (error) {
            console.log(error);
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, [setLoading, setAuth, clearAuth]);

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
