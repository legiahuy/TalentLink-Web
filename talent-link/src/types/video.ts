export interface VideoItem {
  id: string
  title: string
  video_url: string
  thumbnail_url?: string
  created_at: string
  user_id: string
}

export interface VideoListResponse {
  items: VideoItem[]
  total: number
}

export interface VideoUploadPayload {
  file: File
  thumbnail?: File | null
  title?: string
}

export interface VideoUpdatePayload {
  file?: File | null
  thumbnail?: File | null
  title?: string
}
