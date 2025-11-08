import axiosClient from '@/api/axios'
import type { User } from '@/types/user'

export const userService = {
  getMe: async (): Promise<User> => {
    const res = await axiosClient.get('/users/me')
    return res.data?.data ?? res.data
  },
  updateById: async (id: string, payload: Partial<User>): Promise<User> => {
    const res = await axiosClient.put(`/users/${id}`, payload)
    return res.data?.data ?? res.data
  },
  uploadAvatar: async (file: File): Promise<string> => {
    const tryFields = ['file', 'avatar', 'image']
    let lastErr: any
    for (const field of tryFields) {
      try {
        const form = new FormData()
        form.append(field, file)
        const res = await axiosClient.post('/users/me/avatar', form)
        const data = res.data?.data ?? res.data
        return data?.url ?? data?.file_url ?? data?.path ?? ''
      } catch (e) {
        lastErr = e
        continue
      }
    }
    throw lastErr
  },
  uploadCover: async (file: File): Promise<string> => {
    const tryFields = ['file', 'cover', 'image']
    let lastErr: any
    for (const field of tryFields) {
      try {
        const form = new FormData()
        form.append(field, file)
        const res = await axiosClient.post('/users/me/cover', form)
        const data = res.data?.data ?? res.data
        return data?.url ?? data?.file_url ?? data?.path ?? ''
      } catch (e) {
        lastErr = e
        continue
      }
    }
    throw lastErr
  },
  getMyAvatar: async (): Promise<{ file_url: string } | null> => {
    const res = await axiosClient.get('/users/me/avatar')
    return res.data ?? null
  },
  getMyCover: async (): Promise<{ file_url: string } | null> => {
    const res = await axiosClient.get('/users/me/cover')
    return res.data ?? null
  },
}


