import axiosClient from '@/api/axios'
import type { User } from '@/types/user'
import type { Media } from '@/types/media'
import type { Experience } from '@/types/experience'

export const userService = {
  // USER
  getMe: async (): Promise<User> => {
    const res = await axiosClient.get('/users/me')
    return res.data?.data ?? res.data
  },

  getUser: async (id: string): Promise<User> => {
    const res = await axiosClient.get(`/users/${id}`)
    return res.data?.data ?? res.data
  },

  updateById: async (id: string, payload: Partial<User>): Promise<User> => {
    const res = await axiosClient.put(`/users/${id}`, payload)
    return res.data?.data ?? res.data
  },

  // BASIC
  updateBasic: async (payload: {
    display_name?: string
    brief_bio?: string
    detail_bio?: string
    city?: string
    country?: string
  }): Promise<User> => {
    const res = await axiosClient.put('/users/me/basic', payload)
    return res.data?.data ?? res.data
  },

  // CONTACT  <<< THÊM MỚI
  updateContact: async (payload: { email?: string; phone_number?: string }): Promise<User> => {
    const res = await axiosClient.put('/users/me/contact', payload)
    return res.data?.data ?? res.data
  },

  // AVATAR / COVER
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

  // MEDIA GALLERY
  getMyMedia: async (include_inactive?: boolean): Promise<{ media: Media[]; total: number }> => {
    const res = await axiosClient.get('/users/me/media', {
      params: include_inactive ? { include_inactive: true } : undefined,
    })
    const data = res.data?.data ?? res.data
    return {
      media: data?.media ?? [],
      total: data?.total ?? data?.media?.length ?? 0,
    }
  },

  uploadMedia: async (file: File): Promise<Media> => {
    const form = new FormData()
    form.append('file', file)
    const res = await axiosClient.post('/users/me/media', form)
    return res.data?.data ?? res.data
  },

  deleteMedia: async (id: string): Promise<void> => {
    await axiosClient.delete(`/users/me/media/${id}`)
  },

  // ===== EXPERIENCES =====
  getExperience: async (id: string): Promise<Experience> => {
    const res = await axiosClient.get(`/experiences/${id}`)
    return res.data?.data ?? res.data
  },

  deleteExperience: async (id: string): Promise<void> => {
    await axiosClient.delete(`/experiences/${id}`)
  },

  listUserExperiences: async (userId: string): Promise<Experience[]> => {
    const res = await axiosClient.get(`/users/experiences/${userId}`)
    // backend example hơi “generic”, nên cố gắng tìm mảng hợp lệ
    const data = res.data?.data ?? res.data
    if (Array.isArray(data)) return data as Experience[]
    if (Array.isArray(data?.experiences)) return data.experiences as Experience[]
    // fallback: lấy values đầu tiên là array
    const firstArray = Object.values(data || {}).find(Array.isArray)
    return (firstArray as Experience[]) || []
  },

  createExperience: async (payload: {
    title?: string
    description?: string
    start_date?: string
    end_date?: string
    portfolio_url?: string
  }): Promise<Experience> => {
    const res = await axiosClient.post('/experiences', payload)
    return res.data?.data ?? res.data
  },

  updateExperience: async (id: string, payload: Partial<Experience>): Promise<Experience> => {
    const res = await axiosClient.put(`/experiences/${id}`, payload)
    return res.data?.data ?? res.data
  },

  // ===== SOCIAL LINKS =====
  updateSocial: async (payload: {
    facebook_url?: string
    instagram_url?: string
    youtube_url?: string
  }) => {
    const res = await axiosClient.put('/users/me/social', payload)
    return res.data?.data ?? res.data
  },
}
