import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        const authStore = useAuthStore.getState();

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await authStore.refreshAccessToken();
            const newToken = useAuthStore.getState().accessToken;
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosClient(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
