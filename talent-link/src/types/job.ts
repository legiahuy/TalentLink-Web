// Job Post Types based on Job Service API

export interface JobPost {
  id: string
  title: string
  description: string
  brief_description?: string
  post_type: 'job_offer' | 'gig' | 'availability'
  type?: 'producer' | 'singer' | 'venue'
  status: 'draft' | 'published' | 'closed' | 'completed' | 'cancelled'
  visibility: 'public' | 'private' | 'invite_only'

  // Creator Info
  creator_id: string
  creator_role: string
  creator_display_name?: string
  creator_username?: string
  creator_avatar?: string

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
  recruitment_type?: 'full_time' | 'part_time' | 'contract' | 'one_time'
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
  type?: 'producer' | 'singer' | 'venue'
  status?: 'draft' | 'published' | 'closed' | 'completed' | 'cancelled'
  visibility?: 'public' | 'private' | 'invite_only'
  location?: string
  location_type?: 'remote' | 'onsite' | 'hybrid'
  budget_min?: number
  budget_max?: number
  budget_currency?: 'USD' | 'EUR' | 'JPY' | 'VND'
  is_negotiable?: boolean
  payment_type?: 'bySession' | 'byHour' | 'byProject' | 'byMonth'
  recruitment_type?: 'full_time' | 'part_time' | 'contract' | 'one_time'
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

export type UpdateJobPostRequest = Partial<CreateJobPostRequest>

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
  message: string
  media: {
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
}

export interface ListMediaResponse {
  media: MediaResponse[]
  total: number
}

// My Submissions Response
export interface MySubmissionItem {
  id: string
  job?: {
    id: string
    title: string
    creator_id: string
    creator_role: string
    post_type: string
    status: string
    pool_type?: string
    submission_deadline?: string
    total_submissions?: number
  }
  demo_file: string
  cover_letter?: string
  portfolio_links?: string[]
  status: 'pending_review' | 'under_review' | 'accepted' | 'rejected' | 'skipped' | 'withdrawn'
  can_withdraw: boolean
  rejection_reason?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface MySubmissionsResponse {
  submissions: MySubmissionItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
  pending_count: number
  accepted_count: number
  rejected_count: number
}

// Submission List Response (for job owners)
export interface SubmissionListResponse {
  submissions: SubmissionResponse[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Submission Detail Response
export interface UserProfileDTO {
  id: string
  username: string
  full_name: string
  role: string
  avatar_url?: string
  bio?: string
  brief_bio?: string
  location?: string
  website?: string
  genres?: string[]
  verified?: boolean
}

export interface SubmissionActionDTO {
  id: string
  submission_id: string
  action_type: string
  actor_id: string
  actor_role: string
  previous_status?: string
  new_status?: string
  notes?: string
  metadata?: Record<string, unknown>
  created_at: string
}

export interface SubmissionDetailResponse extends SubmissionResponse {
  creator_profile?: UserProfileDTO
  recent_actions?: SubmissionActionDTO[]
}

// Submission Timeline Response
export interface SubmissionTimelineResponse {
  submission_id: string
  actions: SubmissionActionDTO[]
  total: number
}

// Pool Statistics Response
export interface PoolStatisticsResponse {
  pool_id: string
  total_submissions: number
  pending_review: number
  under_review: number
  accepted: number
  rejected: number
  skipped: number
  withdrawn: number
  acceptance_rate?: number
  average_review_time?: number
  views_count?: number
}

// Bulk Action Response
export interface BulkActionResultItem {
  submission_id: string
  success: boolean
  error?: string
}

export interface BulkActionResponse {
  success_count: number
  failure_count: number
  results: BulkActionResultItem[]
}

// Search and Matching Service Types
export interface JobSearchRequest {
  query?: string
  postType?: string
  creatorRole?: string
  locationType?: 'remote' | 'onsite' | 'hybrid'
  type?: 'producer' | 'singer' | 'venue'
  location?: string
  city?: string
  country?: string
  budgetMin?: number
  budgetMax?: number
  budgetCurrency?: string
  paymentType?: string
  deadlineFrom?: string
  deadlineTo?: string
  startDateFrom?: string
  startDateTo?: string
  experienceLevel?: string
  genres?: string[]
  requiredSkills?: string[]
  recruitmentType?: 'full_time' | 'part_time' | 'contract' | 'one_time'
  status?: string
  visibility?: string
  isActive?: boolean
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface JobPostSearchDto {
  id: string
  creatorId: string
  creatorUsername?: string
  creatorDisplayName?: string
  creatorAvatarUrl?: string
  creatorRole: string
  postType: string
  title: string
  type?: string
  description?: string
  briefDescription?: string
  locationType?: string
  location?: string
  venueAddress?: string
  locationText?: string
  budgetMin?: number
  budgetMax?: number
  budgetCurrency?: string
  paymentType?: string
  recruitmentType?: string
  deadline?: string | null
  experienceLevel?: string
  genres?: string[]
  requiredSkills?: string[]
  benefits?: string[]
  status: string
  visibility: string
  viewsCount?: number
  applicationsCount?: number
  bookingsCount?: number
  publishedAt?: string | null
  closedAt?: string | null
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface JobSearchResult {
  jobPosts: JobPostSearchDto[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  searchTime?: string
}

export interface ApiResult<T = unknown> {
  code: number
  message: string
  data?: T
  errors?: string[]
}
