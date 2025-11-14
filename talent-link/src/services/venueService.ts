import axiosClient from '@/api/axios'

export const venueService = {
  updateBasic: async (payload: {
    display_name?: string
    business_type?: string[]
    capacity?: string
  }) => {
    const res = await axiosClient.put('/users/me/venue/basic', payload)
    return res.data?.data ?? res.data
  },

  updateContact: async (payload: {
    city?: string
    country?: string
    detailed_address?: string
    email?: string
    phone_number?: string
    website_url?: string
  }) => {
    const res = await axiosClient.put('/users/me/venue/contact', payload)
    return res.data?.data ?? res.data
  },

  updateAdditional: async (payload: {
    convenient_facilities?: string[]
    open_hour?: string
    rent_price?: string
  }) => {
    const res = await axiosClient.put('/users/me/venue/additional', payload)
    return res.data?.data ?? res.data
  },

  // ---- IMAGE ----
  uploadAvatar: async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await axiosClient.post('/users/me/avatar', form)
    return res.data.data
  },

  uploadCover: async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await axiosClient.post('/users/me/cover', form)
    return res.data.data
  },

  getMedia: async () => {
    const res = await axiosClient.get('/users/me/media')
    return res.data.data
  },

  uploadMedia: async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await axiosClient.post('/users/me/media', form)
    return res.data.data
  },

  deleteMedia: async (id: string) => {
    await axiosClient.delete(`/users/me/media/${id}`)
  },
}
