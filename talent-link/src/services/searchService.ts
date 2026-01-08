import axiosClient from '@/api/axios'
import type {
  ApiResult,
  JobSearchRequestDto,
  JobSearchResultDto,
  UserSearchRequestDto,
  UserSearchResultDto,
  BackendJobSearchResponse,
  BackendUserSearchResponse,
} from '@/types/search'

export const searchService = {
  // ===== JOBS =====

  searchJobs: async (request: JobSearchRequestDto): Promise<JobSearchResultDto> => {
    const res = await axiosClient.post<BackendJobSearchResponse>('/search/jobs', request)
    
    // Backend returns: { posts: [...], pagination: {...} }
    // Transform to frontend expected format: { jobPosts: [...], totalCount, page, pageSize, totalPages, searchTime }
    // Backend returns data directly (not wrapped in ApiResult)
    const backendData = res.data
    
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
    
    // Backend returns: [...] (just an array of all matching users - no server-side pagination)
    // Transform to frontend expected format: { userProfiles: [...], totalCount, page, pageSize, totalPages, searchTime }
    // Backend returns data directly (not wrapped in ApiResult)
    // NOTE: Backend doesn't support pagination, so we do client-side pagination
    const backendData = Array.isArray(res.data) ? res.data : []
    const page = request.page || 1
    const pageSize = request.pageSize || 20
    const totalCount = backendData.length
    
    // Client-side pagination: slice the array to return only the requested page
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUserProfiles = backendData.slice(startIndex, endIndex)
    const totalPages = Math.ceil(totalCount / pageSize)
    
    return {
      userProfiles: paginatedUserProfiles,
      totalCount,
      page,
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
