import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    isLoading: false,

    signUp: async (username, email, password, role) => {
        try {
            set({ isLoading: true });

            await authService.signUp(username, email, password, role);
            toast.success(
                'Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập',
            );
        } catch (error) {
            console.error(error);
            toast.error('Đăng ký không thành công');
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        try {
            set({ isLoading: true });

            const res = await authService.login(email, password);
            console.log(res);
            toast.success('Chào mừng bạn quay lại TalentLink!');
        } catch (error) {
            console.error(error);
            toast.error('Đăng nhập không thành công!');
        } finally {
            set({ isLoading: false });
        }
    },
}));
