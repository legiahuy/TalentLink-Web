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
  isInitialized: boolean

  loading: boolean
  error: string | null

  // actions
  initialize: () => Promise<void>
  signUp: (
    display_name: string,
    username: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
  fetchUser: () => Promise<void>
  setTokens: (access: string, refresh?: string) => void
  verifyEmail: (email: string, code: string) => Promise<void>
  resendVerificationEmail: (email: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      // expiresAt: null,
      isAuthenticated: false,
      isInitialized: false,
      loading: false,
      error: null,

      initialize: async () => {
        // Guard: tránh initialize nhiều lần
        if (get().isInitialized || get().loading) return

        try {
          const { accessToken } = get()

          // Fast path: không có token → skip API call
          if (!accessToken) {
            set({ isInitialized: true })
            return
          }

          // Có token → verify bằng cách fetch user
          await get().fetchUser()
          set({ isInitialized: true })
        } catch (error) {
          // Token invalid → clear everything
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isInitialized: true, // ← Vẫn set true (đã check xong)
          })
          console.error(error)
        }
      },

      setTokens: (access, refresh) => {
        // const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
        set({
          accessToken: access,
          refreshToken: refresh ?? get().refreshToken,
          // expiresAt,
          isAuthenticated: true,
        })
      },

      signUp: async (display_name, username, email, password, role) => {
        set({ loading: true, error: null })
        try {
          await authService.signUp({ display_name, username, email, password, role })

          toast.success('Đăng ký thành công! Vui lòng xác minh email của bạn.')
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
        // set({ loading: true })
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
          throw err
        } finally {
          // set({ loading: false })
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

      verifyEmail: async (email, code) => {
        set({ loading: true, error: null })
        try {
          await authService.verifyEmail(email, code)
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Xác minh email không thành công!')
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

      resendVerificationEmail: async (email) => {
        set({ loading: true, error: null })
        try {
          await authService.resendVerificationEmail(email)
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Gửi lại email xác minh thất bại!')
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ loading: false })
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = false
        }
      },
    },
  ),
)
