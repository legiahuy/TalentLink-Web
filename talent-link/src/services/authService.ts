import axiosClient from '@/api/axios'
import type { User } from '@/types/user'
import axios from 'axios'

export interface LoginResponse {
  access_token: string
  refresh_token: string
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
}

export interface SignUpParams {
  display_name: string
  username: string
  email: string
  password: string
  role: string
}

/**
 * Service layer for authentication API calls
 */
export const authService = {
  /**
   * Sign up a new user
   */
  signUp: async (params: SignUpParams): Promise<void> => {
    console.log(params)
    const res = await axiosClient.post('/auth/signup', params)
    console.log(res)
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await axiosClient.post('/auth/login', { identifier: email, password })
    return res.data.data
  },

  /**
   * Logout current user
   */
  logout: async (refreshToken: string): Promise<void> => {
    await axiosClient.post('/auth/logout', { refresh_token: refreshToken })
  },

  /**
   * Refresh access token
   */
  refreshAccessToken: async (refreshToken: string): Promise<RefreshResponse> => {
    const res = await axiosClient.post('/auth/refresh', { refresh_token: refreshToken })
    return res.data.data
  },

  /**
   * Fetch current user data
   */
  fetchUser: async (): Promise<User> => {
    const res = await axiosClient.get('/users/me')
    return res.data
  },

  /**
   * Get error message from axios error
   */
  getErrorMessage: (err: unknown, defaultMessage: string): string => {
    return axios.isAxiosError(err) ? err.response?.data?.message || defaultMessage : defaultMessage
  },
}
