import axiosClient from '@/api/axios'
import type {
  VideoItem,
  VideoListResponse,
  VideoUploadPayload,
  VideoUpdatePayload,
} from '@/types/video'

export const videoService = {
  async getUserVideos(username: string): Promise<VideoListResponse> {
    const res = await axiosClient.get(`/users/videos/all/${username}`)
    const data = res.data?.data ?? res.data
    return {
      items: data.items ?? [],
      total: data.total ?? 0,
    }
  },

  async uploadVideo(payload: VideoUploadPayload): Promise<VideoItem> {
    const form = new FormData()
    form.append('file', payload.file)
    if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
    if (payload.title) form.append('title', payload.title)

    const res = await axiosClient.post('/users/videos', form)
    return res.data?.data ?? res.data
  },

  async updateVideo(videoId: string, payload: VideoUpdatePayload): Promise<VideoItem> {
    const form = new FormData()
    if (payload.file) form.append('file', payload.file)
    if (payload.thumbnail) form.append('thumbnail', payload.thumbnail)
    if (payload.title) form.append('title', payload.title)

    const res = await axiosClient.put(`/users/videos/${videoId}`, form)
    return res.data?.data ?? res.data
  },

  async deleteVideo(videoId: string): Promise<void> {
    await axiosClient.delete(`/users/videos/${videoId}`)
  },
}
