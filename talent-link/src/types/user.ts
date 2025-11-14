export const UserRole = {
  VENUE: 'venue',
  PRODUCER: 'producer',
  SINGER: 'singer',
  ADMIN: 'admin',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface User {
  id: string
  email?: string
  display_name?: string
  phone_number?: string
  city?: string
  country?: string
  brief_bio?: string
  detail_bio?: string
  role: UserRole
  avatar?: string
  is_verified: boolean
  status: string
  username: string
}

export const isArtist = (role: UserRole) => 
  role === UserRole.SINGER || role === UserRole.PRODUCER
