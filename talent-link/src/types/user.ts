export const UserRole = {
  VENUE: 'venue',
  PRODUCER: 'producer',
  SINGER: 'singer',
  ADMIN: 'admin',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface Genre {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email?: string
  display_name?: string
  phone_number?: string
  city?: string
  country?: string
  brief_bio?: string
  detail_bio?: string
  role: string
  avatar_url?: string
  cover_url?: string
  is_verified: boolean
  status: string
  username: string

  // New fields
  business_types?: string[]
  capacity?: string
  convenient_facilities?: string[]
  created_at?: string
  detailed_address?: string
  facebook_url?: string
  featured_release_links?: string[]
  genres?: Genre[]
  instagram_url?: string
  open_hour?: string
  rent_price?: string
  updated_at?: string
  website_url?: string
  youtube_url?: string
}

export const isArtist = (role: UserRole) => role === UserRole.SINGER || role === UserRole.PRODUCER

export interface UserBasicUpdatePayload {
  display_name?: string
  brief_bio?: string
  detail_bio?: string
  city?: string
  country?: string
}

export interface UserContactUpdatePayload {
  email?: string
  phone_number?: string
}

export interface UserSocialUpdatePayload {
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
}

export interface UserGenresUpdatePayload {
  genre_names: string[]
}

export interface AvatarResponse {
  file_url: string
}

export interface CoverResponse {
  file_url: string
}
