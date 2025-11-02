import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

import type { User } from '@/types/user'
import { authService } from '@/services/authService'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  // expiresAt: number | null;
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // actions
  signUp: (display_name: string, email: string, password: string, role: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
  fetchUser: () => Promise<void>
  setTokens: (access: string, refresh?: string) => void
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
        })
      },

      signUp: async (display_name, email, password, role) => {
        set({ loading: true, error: null })
        try {
          await authService.signUp({ display_name, email, password, role })

          toast.success('Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.')
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Đăng ký không thành công!')
          set({ error: message })
          toast.error(message)
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { access_token, refresh_token } = await authService.login(email, password)
          get().setTokens(access_token, refresh_token)
          await get().fetchUser()
          // set({ user });
          toast.success('Chào mừng bạn quay lại TalentLink!')
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Đăng nhập không thành công!')
          set({ error: message })
          toast.error(message)
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

      refreshAccessToken: async () => {
        set({ loading: true })
        try {
          const { refreshToken } = get()
          if (!refreshToken) throw new Error('Missing refresh token')
          const { access_token, refresh_token } = await authService.refreshAccessToken(refreshToken)
          get().setTokens(access_token, refresh_token)
          console.log('Access token has been refreshed successfully')
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Refresh failed! Logout')
          set({ error: message })
          console.warn('Refresh failed! Logout')
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            // expiresAt: null,
            isAuthenticated: false,
          })
        } finally {
          set({ loading: false })
        }
      },

      fetchUser: async () => {
        set({ loading: true })
        try {
          const userData = await authService.fetchUser()
          console.log(userData)
          set({ user: userData, isAuthenticated: true })
        } catch (err) {
          console.error(err)
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          })
          toast.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!')
        } finally {
          set({ loading: false })
        }
      },

      logout: async () => {
        try {
          const { refreshToken } = get()
          if (!refreshToken) throw new Error('Missing refresh token')
          await authService.logout(refreshToken)
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            // expiresAt: null,
            isAuthenticated: false,
          })
          toast.success('Đăng xuất thành công!')
        } catch (err) {
          console.error(err)
          toast.error('Lỗi xảy ra khi logout. Hãy thử lại!')
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        // expiresAt: state.expiresAt,
      }),
    },
  ),
)
