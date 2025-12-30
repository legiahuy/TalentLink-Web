import axiosClient from '@/api/axios'
import type {
  FeaturedUser,
  FeaturedJob,
  FeaturedUsersResponse,
  FeaturedJobsResponse,
  FeatureActionResponse,
  AdminPaginationParams,
} from '@/types/admin'
import { mockAdminData } from './mockAdminData'

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_DATA === 'true'

export const adminService = {
  // ===== FEATURED USERS =====
  
  listFeaturedUsers: async (params?: AdminPaginationParams): Promise<FeaturedUsersResponse> => {
    const { limit = 50, offset = 0 } = params || {}
    
    if (useMockData) {
      return mockAdminData.getFeaturedUsers(limit, offset)
    }
    
    const res = await axiosClient.get('/admin/users/featured', {
      params: { limit, offset },
    })
    return res.data
  },

  featureUser: async (userId: string): Promise<FeatureActionResponse> => {
    if (useMockData) {
      return mockAdminData.featureUser(userId)
    }
    
    const res = await axiosClient.post(`/admin/users/${userId}/feature`)
    return res.data
  },

  unfeatureUser: async (userId: string): Promise<FeatureActionResponse> => {
    if (useMockData) {
      return mockAdminData.unfeatureUser(userId)
    }
    
    const res = await axiosClient.delete(`/admin/users/${userId}/feature`)
    return res.data
  },

  // ===== FEATURED JOBS =====
  
  listFeaturedJobs: async (params?: AdminPaginationParams): Promise<FeaturedJobsResponse> => {
    const { limit = 50, offset = 0 } = params || {}
    
    if (useMockData) {
      return mockAdminData.getFeaturedJobs(limit, offset)
    }
    
    const res = await axiosClient.get('/admin/posts/featured', {
      params: { limit, offset },
    })
    return res.data
  },

  featureJob: async (jobId: string): Promise<FeatureActionResponse> => {
    if (useMockData) {
      return mockAdminData.featureJob(jobId)
    }
    
    const res = await axiosClient.post(`/admin/posts/${jobId}/feature`)
    return res.data
  },

  unfeatureJob: async (jobId: string): Promise<FeatureActionResponse> => {
    if (useMockData) {
      return mockAdminData.unfeatureJob(jobId)
    }
    
    const res = await axiosClient.delete(`/admin/posts/${jobId}/feature`)
    return res.data
  },

  // ===== SEARCH =====
  
  searchUsers: async (query: string): Promise<FeaturedUser[]> => {
    if (useMockData) {
      return mockAdminData.searchUsers(query)
    }
    
    const res = await axiosClient.get('/search/users', {
      params: { q: query },
    })
    return res.data.data || []
  },

  searchJobs: async (query: string): Promise<FeaturedJob[]> => {
    if (useMockData) {
      return mockAdminData.searchJobs(query)
    }
    
    const res = await axiosClient.get('/search/posts', {
      params: { q: query },
    })
    return res.data.data || []
  },

  // ===== UTILITY =====
  
  isMockMode: (): boolean => {
    return useMockData
  },
}
