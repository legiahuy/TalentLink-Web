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

  // 🟩 ADD
  userRole: string | null
  setUserRole: (role: string | null) => void

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
  // forgot password flow
  requestPasswordReset: (email: string) => Promise<void>
  resendPasswordReset: (email: string) => Promise<void>
  confirmPasswordReset: (email: string, code: string) => Promise<string>
  resetPassword: (email: string, newPassword: string, resetToken: string) => Promise<void>

  // OAuth
  oauthLogin: (code: string, codeVerifier: string) => Promise<void>
  completeOAuth: (
    registrationToken: string,
    role: 'producer' | 'singer' | 'venue',
    username: string,
  ) => Promise<void>

  pendingRegistrationToken?: string | null
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

      // 🟩 ADD: init role
      userRole: null,
      pendingRegistrationToken: null,

      // 🟩 ADD: setter role
      setUserRole: (role) => {
        set({ userRole: role })
        if (typeof window !== 'undefined') {
          if (role) document.cookie = `user_role=${role}; path=/`
          else document.cookie = `user_role=; Max-Age=0; path=/`
        }
      },

      oauthLogin: async (code, codeVerifier) => {
        set({ loading: true, error: null })
        try {
          const { access_token, refresh_token, is_registered, registration_token } =
            await authService.oauthLogin(code, codeVerifier)

          if (is_registered) {
            get().setTokens(access_token, refresh_token)
            await get().fetchUser()

            const role = get().user?.role
            if (role) get().setUserRole(role)

            toast.success('Đăng nhập với Google thành công!')
          } else if (registration_token) {
            set({ pendingRegistrationToken: registration_token })
          }
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Đăng nhập Google không thành công!')
          set({ error: message })
          toast.error(message)
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

      completeOAuth: async (registrationToken, role, username) => {
        set({ loading: true, error: null })
        try {
          const { access_token, refresh_token } = await authService.completeOAuth(
            registrationToken,
            role,
            username,
          )

          get().setTokens(access_token, refresh_token)
          set({ pendingRegistrationToken: null })

          await get().fetchUser()

          const finalRole = get().user?.role || role
          if (finalRole) get().setUserRole(finalRole)

          toast.success('Hoàn tất đăng ký Google thành công!')
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Hoàn tất đăng ký Google thất bại!')
          set({ error: message })
          toast.error(message)
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

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

          // 🟩 ADD: store role
          const role = get().user?.role
          if (role) get().setUserRole(role)

          toast.success('Chào mừng bạn quay lại TalentLink!')

          // if (typeof window !== 'undefined') {
          //   const targetUsername = get().user?.username || username
          //   if (targetUsername) {
          //     window.location.href = `/profile/${targetUsername}`
          //   } else {
          //     window.location.href = '/profile'
          //   }
          // }
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

          // 🟩 ADD: clear role on refresh fail
          get().setUserRole(null)

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
          //console.log(userData)
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

          // 🟩 ADD: clear user role
          get().setUserRole(null)

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

      // Forgot password flow
      requestPasswordReset: async (email) => {
        set({ loading: true, error: null })
        try {
          await authService.requestPasswordReset(email)
          // backend returns generic success even if email does not exist
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Yêu cầu đặt lại mật khẩu thất bại!')
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

      resendPasswordReset: async (email) => {
        set({ loading: true, error: null })
        try {
          await authService.resendPasswordResetRequest(email)
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Gửi lại mã đặt lại mật khẩu thất bại!')
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

      confirmPasswordReset: async (email, code) => {
        set({ loading: true, error: null })
        try {
          const { reset_token } = await authService.confirmPasswordResetRequest(email, code)
          return reset_token
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Mã xác minh không hợp lệ!')
          set({ error: message })
          throw new Error(message)
        } finally {
          set({ loading: false })
        }
      },

      resetPassword: async (email, newPassword, resetToken) => {
        set({ loading: true, error: null })
        try {
          await authService.resetPassword(email, newPassword, resetToken)
        } catch (err) {
          const message = authService.getErrorMessage(err, 'Đặt lại mật khẩu thất bại!')
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

        // 🟩 ADD persist role
        userRole: state.userRole,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = false
        }
      },
    },
  ),
)
