export interface Experience {
  id: string
  user_id: string
  title?: string
  description?: string
  portfolio_url?: string
  start_date?: string | null // ISO
  end_date?: string | null // ISO
  created_at?: string
  updated_at?: string
  genres?: Array<{
    id: string
    name: string
    created_at?: string
    updated_at?: string
  }>
}

export interface ExperienceCreatePayload {
  title?: string
  description?: string
  start_date?: string
  end_date?: string
  portfolio_url?: string
}
