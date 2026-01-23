import axiosClient from '@/api/axios'
import type {
  ApiResult,
  JobSearchRequestDto,
  JobSearchResultDto,
  UserSearchRequestDto,
  UserSearchResultDto,
  BackendJobSearchResponse,
  BackendUserSearchResponse,
  UserSearchDto,
} from '@/types/search'

export const searchService = {
  // ===== JOBS =====

  searchJobs: async (request: JobSearchRequestDto): Promise<JobSearchResultDto> => {
    const res = await axiosClient.post<BackendJobSearchResponse>('/search/jobs', request)

    // Backend returns: { posts: [...], pagination: {...} }
    // Transform to frontend expected format: { jobPosts: [...], totalCount, page, pageSize, totalPages, searchTime }
    // Backend returns data directly (not wrapped in ApiResult)
    // Backend returns data directly or wrapped in data field
    const backendData = (res.data as any)?.data ?? res.data

    return {
      jobPosts: backendData.posts || [],
      totalCount: backendData.pagination?.total_items || 0,
      page: backendData.pagination?.current_page || 1,
      pageSize: backendData.pagination?.page_size || 20,
      totalPages: backendData.pagination?.total_pages || 0,
      searchTime: new Date().toISOString(), // Generate searchTime since backend doesn't provide it
    }
  },

  getJobSuggestions: async (query: string, maxSuggestions = 10): Promise<string[]> => {
    const res = await axiosClient.get<ApiResult<string[]>>('/search/jobs/suggestions', {
      params: { query, maxSuggestions },
    })
    return res.data.data
  },

  // ===== USERS =====

  searchUsers: async (request: UserSearchRequestDto): Promise<UserSearchResultDto> => {
    const res = await axiosClient.post<BackendUserSearchResponse>('/search/users', request)

    // Backend might return an array (legacy) or an object with pagination (new)
    // Backend returns data directly or wrapped in data field
    const backendData = (res.data as any)?.data ?? res.data

    let users: UserSearchDto[] = []
    let pagination = null

    if (Array.isArray(backendData)) {
      users = backendData
    } else if (typeof backendData === 'object' && backendData !== null && 'users' in backendData) {
      users = backendData.users
      pagination = backendData.pagination
    }

    const totalCount = pagination?.total_items || users.length
    const currentPage = pagination?.current_page || request.page || 1
    const pageSize = pagination?.page_size || request.pageSize || 20
    const totalPages = pagination?.total_pages || Math.ceil(totalCount / pageSize)

    // If no server-side pagination (legacy array response), do client-side slicing
    let finalUsers = users
    if (!pagination && users.length > pageSize) {
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      finalUsers = users.slice(startIndex, endIndex)
    }

    // Map backend snake_case to frontend camelCase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedUsers: UserSearchDto[] = finalUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      role: u.role,
      avatarUrl: u.avatar_url,
      isValidated: u.is_verified,
      displayName: u.display_name,
      location: u.city || u.location, // Handle potentially different field names
      genres: u.genres,
      phoneNumber: u.phone_number,
      briefBio: u.brief_bio,
      capacity: u.capacity,
      openHour: u.open_hour,
      rentPrice: u.rent_price,
      businessTypes: u.business_types,
      convenientFacilities: u.convenient_facilities,
    }))

    return {
      userProfiles: mappedUsers,
      totalCount,
      page: currentPage,
      pageSize,
      totalPages,
      searchTime: new Date().toISOString(), // Generate searchTime since backend doesn't provide it
    }
  },

  // ===== COMBINED =====

  searchAll: async (query: string): Promise<{ jobs: JobSearchResultDto; users: UserSearchResultDto }> => {
    const [jobs, users] = await Promise.all([
      searchService.searchJobs({
        query,
        isActive: true,
        status: 'published',
        page: 1,
        pageSize: 10,
      }),
      searchService.searchUsers({
        query,
        page: 1,
        pageSize: 10,
      }),
    ])

    return { jobs, users }
  },
}
