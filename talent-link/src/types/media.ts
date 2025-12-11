export interface Media {
    id: string
    user_id: string
    file_name: string
    file_size: number
    file_url: string
    mime_type: string
    media_type: string
    width: number
    height: number
    created_at: string
    updated_at: string
  }
  
  export interface MediaListResponse {
    media: Media[]
    total: number
  }
  