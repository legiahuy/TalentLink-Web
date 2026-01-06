export interface ApiResult<T> {
  code: number
  message: string
  data: T
  errors?: string[]
}

// ===== JOBS =====

export interface JobSearchRequestDto {
  query?: string
  postType?: string
  creatorRole?: string
  type?: string
  recruitmentType?: string
  locationType?: string
  location?: string
  budgetMin?: number
  budgetMax?: number
  budgetCurrency?: string
  paymentType?: string
  deadlineFrom?: string // dd-MM-yyyy
  deadlineTo?: string // dd-MM-yyyy
  experienceLevel?: string
  genres?: string[]
  requiredSkills?: string[]
  benefits?: string[]
  status?: string
  visibility?: string
  isActive?: boolean
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}

export interface JobSearchResultDto {
  jobPosts: JobPostSearchDto[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  searchTime: string
}

export interface JobPostSearchDto {
  id: string
  creatorId: string
  creatorUsername: string
  creatorDisplayName: string
  creatorAvatarUrl: string
  creatorRole: string
  postType: string
  type?: string
  recruitmentType?: string
  title: string
  description: string
  locationType?: string
  location?: string
  venueAddress?: string
  locationText?: string
  budgetMin?: number
  budgetMax?: number
  budgetCurrency?: string
  paymentType?: string
  deadline?: string
  experienceLevel?: string
  genres?: string[]
  requiredSkills?: string[]
  benefits?: string[]
  status: string
  visibility: string
  viewsCount?: number
  applicationsCount?: number
  bookingsCount?: number
  publishedAt?: string
  closedAt?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// ===== USERS =====

export interface UserSearchRequestDto {
  query?: string
  role?: string
  location?: string
  genres?: string[]
  openHour?: string
  rentPrice?: string
  capacity?: string
  businessTypes?: string[]
  convenientFacilities?: string[]
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
}

export interface UserSearchResultDto {
  userProfiles: UserSearchDto[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  searchTime: string
}

export interface UserSearchDto {
  id: string
  email: string
  username: string
  role: string
  avatarUrl: string
  isValidated: boolean
  displayName: string
  location?: string
  genres?: { id: string; name: string }[]
  phoneNumber?: string
  briefBio?: string
  capacity?: string
  openHour?: string
  rentPrice?: string
  businessTypes?: string[]
  convenientFacilities?: string[]
}
