import { axiosInstance } from '@/lib/axios';

export const authService = {
    signUp: async (
        username: string,
        email: string,
        password: string,
        role: string,
    ) => {
        const res = await axiosInstance.post('/auth/signup', {
            username,
            email,
            password,
            role,
        });

        return res.data;
    },

    login: async (email: string, password: string) => {
        const res = await axiosInstance.post('/auth/login', {
            email,
            password,
        });

        return res.data;
    },
};
