import axiosClient from '@/api/axios'
import type {
  VenueBasicUpdatePayload,
  VenueContactUpdatePayload,
  VenueAdditionalUpdatePayload,
} from '@/types/venue'
import type { User, AvatarResponse, CoverResponse } from '@/types/user'
import type { Media, MediaListResponse } from '@/types/media'

export const venueService = {
  updateBasic: async (payload: VenueBasicUpdatePayload): Promise<User> => {
    const res = await axiosClient.put('/users/me/venue/basic', payload)
    return res.data?.data ?? res.data
  },

  updateContact: async (payload: VenueContactUpdatePayload): Promise<User> => {
    const res = await axiosClient.put('/users/me/venue/contact', payload)
    return res.data?.data ?? res.data
  },

  updateAdditional: async (payload: VenueAdditionalUpdatePayload): Promise<User> => {
    const res = await axiosClient.put('/users/me/venue/additional', payload)
    return res.data?.data ?? res.data
  },

  // ---- IMAGE ----
  uploadAvatar: async (file: File): Promise<AvatarResponse> => {
    const form = new FormData()
    form.append('file', file)
    const res = await axiosClient.post('/users/me/avatar', form)
    return res.data.data
  },

  uploadCover: async (file: File): Promise<CoverResponse> => {
    const form = new FormData()
    form.append('file', file)
    const res = await axiosClient.post('/users/me/cover', form)
    return res.data.data
  },

  getMedia: async (): Promise<MediaListResponse> => {
    const res = await axiosClient.get('/users/me/media')
    return res.data.data
  },

  uploadMedia: async (file: File): Promise<Media> => {
    const form = new FormData()
    form.append('file', file)
    const res = await axiosClient.post('/users/me/media', form)
    // Handle different response formats
    return res.data?.data ?? res.data
  },

  deleteMedia: async (id: string): Promise<void> => {
    await axiosClient.delete(`/users/me/media/${id}`)
  },
}
