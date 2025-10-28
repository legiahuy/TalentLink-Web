import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from 'sonner';

import axiosClient from "@/api/axios";
import type { User } from "@/types/user";
import axios from "axios";


interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    // expiresAt: number | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;

    // actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
    fetchUser: () => Promise<void>;
    setTokens: (access: string, refresh?: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            // expiresAt: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            setTokens: (access, refresh) => {
                // const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
                set({
                    accessToken: access,
                    refreshToken: refresh ?? get().refreshToken,
                    // expiresAt,
                    isAuthenticated: true,
                });
            },

            login: async (email, password) => {
                set({ loading: true, error: null });
                try {
                    const res = await axiosClient.post("/auth/login", { email, password });

                    const { access_token, refresh_token } = res.data.data;
                    get().setTokens(access_token, refresh_token);
                    await get().fetchUser();
                    // set({ user });
                    toast.success('Chào mừng bạn quay lại TalentLink!');
                } catch (err) {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message || 'Đăng nhập không thành công!'
                        : 'Đăng nhập không thành công!';
                    set({ error: message });
                    toast.error(message);
                } finally {
                    set({ loading: false });
                }
            },

            refreshAccessToken: async () => {
                set({ loading: true });
                try {
                    const { refreshToken } = get();
                    if (!refreshToken) throw new Error("Missing refresh token");
                    const res = await axiosClient.post("/auth/refresh", { refresh_token: refreshToken });
                    const { access_token } = res.data;
                    get().setTokens(access_token, undefined);
                } catch (err) {
                    const message = axios.isAxiosError(err)
                        ? err.response?.data?.message || 'Refresh failed! Logout'
                        : 'Refresh failed! Logout';
                    set({ error: message });
                    console.warn("Refresh failed! Logout");
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        // expiresAt: null,
                        isAuthenticated: false,
                    });
                }
                finally {
                    set({ loading: false });
                }
            },

            fetchUser: async () => {
                set({ loading: true });
                try {
                    const res = await axiosClient.get("/users/me");
                    console.log(res.data)
                    set({ user: res.data, isAuthenticated: true });
                } catch (err) {
                    console.error(err);
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                    });
                    toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
                }
                finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                try {
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        // expiresAt: null,
                        isAuthenticated: false,
                    });
                    await axiosClient.get("/auth/logout");
                    toast.success("Đăng xuất thành công!");
                }
                catch (err) {
                    console.error(err);
                    toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
                }

            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                // expiresAt: state.expiresAt,
            }),
        }
    )
);
