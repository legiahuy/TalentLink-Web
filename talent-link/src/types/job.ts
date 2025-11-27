// Job Post Types based on Job Service API

export interface JobPost {
  id: string
  title: string
  description: string
  brief_description?: string
  post_type: 'job_offer' | 'gig' | 'availability'
  type?: 'band' | 'musician' | 'dj' | 'producer'
  status: 'draft' | 'published' | 'closed' | 'completed' | 'cancelled'
  visibility: 'public' | 'private' | 'invite_only'
  
  // Creator Info
  creator_id: string
  creator_role: string
  
  // Location
  location?: string
  location_type?: 'remote' | 'onsite' | 'hybrid'
  
  // Budget
  budget_min?: number
  budget_max?: number
  budget_currency?: 'USD' | 'EUR' | 'JPY' | 'VND'
  is_negotiable?: boolean
  payment_type?: 'bySession' | 'byHour' | 'byProject' | 'byMonth'
  
  // Requirements
  experience_level?: 'beginner' | 'intermediate' | 'expert' | 'any'
  required_skills?: string[]
  genres?: string[]
  benefits?: string[]
  
  // Dates
  deadline?: string
  submission_deadline?: string
  created_at: string
  updated_at: string
  published_at?: string
  closed_at?: string
  
  // Pool/Opportunity specific
  is_pool?: boolean
  pool_type?: 'opportunity' | 'job'
  max_submissions?: number
  
  // Recruitment
  recruitment_type?: 'full_time' | 'part_time' | 'flexible'
  work_time?: string
  
  // Stats
  total_submissions?: number
  applications_count?: number
  bookings_count?: number
  shortlisted_count?: number
  views_count?: number
  
  // Computed
  can_accept_submissions?: boolean
  is_deadline_passed?: boolean
  
  // Relations (optional)
  assets?: AssetResponse[]
  tags?: TagResponse[]
  invites?: InviteResponse[]
  
  // Notifications
  auto_notify?: boolean
}

export interface AssetResponse {
  id: string
  asset_type: string
  file_name: string
  file_size: number
  mime_type: string
  storage_key: string
  storage_url: string
  thumbnail_url?: string
  duration?: number
  created_at: string
}

export interface TagResponse {
  id: string
  tag_type: string
  tag_value: string
  created_at: string
}

export interface InviteResponse {
  id: string
  invitee_id?: string
  invitee_email?: string
  invitee_name?: string
  message?: string
  status: string
  invited_at: string
  responded_at?: string
  expires_at?: string
}

export interface PaginationMeta {
  current_page: number
  page_size: number
  total_items: number
  total_pages: number
}

export interface JobPostListResponse {
  posts: JobPost[]
  pagination: PaginationMeta
}

export interface CreateJobPostRequest {
  title: string
  description: string
  brief_description?: string
  post_type: 'job_offer' | 'gig' | 'availability'
  type?: 'band' | 'musician' | 'dj' | 'producer'
  status?: 'draft' | 'published' | 'closed' | 'completed' | 'cancelled'
  visibility?: 'public' | 'private' | 'invite_only'
  location?: string
  location_type?: 'remote' | 'onsite' | 'hybrid'
  budget_min?: number
  budget_max?: number
  budget_currency?: 'USD' | 'EUR' | 'JPY' | 'VND'
  is_negotiable?: boolean
  payment_type?: 'bySession' | 'byHour' | 'byProject' | 'byMonth'
  recruitment_type?: 'full_time' | 'part_time' | 'flexible'
  experience_level?: 'beginner' | 'intermediate' | 'expert' | 'any'
  required_skills?: string[]
  genres?: string[]
  benefits?: string[]
  work_time?: string
  deadline?: string
  submission_deadline?: string
  is_pool?: boolean
  pool_type?: 'opportunity' | 'job'
  max_submissions?: number
  auto_notify?: boolean
}

export interface UpdateJobPostRequest extends Partial<CreateJobPostRequest> {}

export interface JobPostFilters {
  post_type?: 'job_offer' | 'gig' | 'availability'
  status?: 'draft' | 'published' | 'closed' | 'completed' | 'cancelled'
  visibility?: 'public' | 'private' | 'invite_only'
  creator_id?: string
  location_type?: 'remote' | 'onsite' | 'hybrid'
  location?: string
  budget_min?: number
  budget_max?: number
  genres?: string[]
  required_skills?: string[]
  benefits?: string[]
  experience_level?: 'beginner' | 'intermediate' | 'expert' | 'any'
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Submission Types
export interface CreateSubmissionRequest {
  demo_file: string // Required - URL to demo file
  full_name?: string
  email?: string
  phone_number?: string
  cover_letter?: string
  portfolio_links?: string[]
}

export interface SubmissionResponse {
  id: string
  pool_id: string
  creator_id: string
  demo_file: string
  full_name?: string
  email?: string
  phone_number?: string
  cover_letter?: string
  portfolio_links?: string[]
  status: string
  is_reviewed: boolean
  review_notes?: string
  reviewed_at?: string
  can_withdraw: boolean
  can_be_reviewed: boolean
  created_at: string
  updated_at: string
}

export interface MediaResponse {
  id: string
  user_id: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  created_at: string
  updated_at: string
}
