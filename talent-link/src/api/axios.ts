import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  // If sending FormData, let the browser set multipart boundary
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers && 'Content-Type' in config.headers) {
      const headers = config.headers as Record<string, unknown>
      delete headers['Content-Type']
    }
  }
  return config
})

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore.getState()
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true
      await authStore.refreshAccessToken()
      const newToken = useAuthStore.getState().accessToken
      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosClient(originalRequest)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
