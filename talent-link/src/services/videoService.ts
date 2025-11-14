import axiosClient from '@/api/axios'

export interface VideoItem {
  id: string
  title: string
  video_url: string
  thumbnail_url?: string 
  created_at: string
  user_id: string
}

export const videoService = {
  async getUserVideos(username: string): Promise<{ items: VideoItem[]; total: number }> {
    const res = await axiosClient.get(`/users/videos/all/${username}`)
    const data = res.data?.data ?? res.data
    return {
      items: data.items ?? [],
      total: data.total ?? 0,
    }
  },

  async uploadVideo(payload: {
    file: File
    thumbnail?: File | null
    title?: string
  }) {
    const form = new FormData()
    form.append('file', payload.file)
    if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
    if (payload.title) form.append('title', payload.title)

    const res = await axiosClient.post('/users/videos', form)
    return res.data?.data ?? res.data
  },

  async updateVideo(
    videoId: string,
    payload: { file?: File | null; thumbnail?: File | null; title?: string }
  ) {
    const form = new FormData()
    if (payload.file) form.append('file', payload.file)
    if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
    if (payload.title) form.append('title', payload.title)

    const res = await axiosClient.put(`/users/videos/${videoId}`, form)
    return res.data?.data ?? res.data
  },

  async deleteVideo(videoId: string) {
    return axiosClient.delete(`/users/videos/${videoId}`)
  },
}
