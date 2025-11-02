'use client'
import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
  const { user, isAuthenticated, loading, error, login, logout, fetchUser } = useAuthStore()

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    fetchUser,
  }
}
