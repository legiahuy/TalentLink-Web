'use client'
import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    fetchUser,
    isInitialized,
    verifyEmail,
    resendVerificationEmail,
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isInitialized,
    loading,
    error,
    login,
    logout,
    fetchUser,
    verifyEmail,
    resendVerificationEmail,
  }
}
