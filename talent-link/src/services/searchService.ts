import axiosClient from '@/api/axios'
import type {
  ApiResult,
  JobSearchRequestDto,
  JobSearchResultDto,
  UserSearchRequestDto,
  UserSearchResultDto,
} from '@/types/search'

export const searchService = {
  // ===== JOBS =====

  searchJobs: async (request: JobSearchRequestDto): Promise<JobSearchResultDto> => {
    const res = await axiosClient.post<ApiResult<JobSearchResultDto>>('/search/jobs', request)
    return res.data.data
  },

  getJobSuggestions: async (query: string, maxSuggestions = 10): Promise<string[]> => {
    const res = await axiosClient.get<ApiResult<string[]>>('/search/jobs/suggestions', {
      params: { query, maxSuggestions },
    })
    return res.data.data
  },

  // ===== USERS =====

  searchUsers: async (request: UserSearchRequestDto): Promise<UserSearchResultDto> => {
    const res = await axiosClient.post<ApiResult<UserSearchResultDto>>('/search/users', request)
    return res.data.data
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
