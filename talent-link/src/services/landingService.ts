import axiosClient from '@/api/axios'
import type { FeaturedUser, FeaturedJob } from '@/types/admin'
import { mockAdminData } from './mockAdminData'

// Check if we should use mock data
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_DATA === 'true'

export const landingService = {
  // Get featured users for landing page (public endpoint, no auth required)
  getFeaturedUsers: async (limit = 10): Promise<FeaturedUser[]> => {
    if (useMockData) {
      return mockAdminData.getLandingFeaturedUsers(limit)
    }
    
    try {
      const res = await axiosClient.get('/landing/featured-users', {
        params: { limit },
      })
      return res.data?.data?.users || res.data?.users || []
    } catch (error) {
      console.error('Failed to fetch featured users:', error)
      return []
    }
  },

  // Get featured jobs for landing page (public endpoint, no auth required)
  getFeaturedJobs: async (limit = 10): Promise<FeaturedJob[]> => {
    if (useMockData) {
      return mockAdminData.getLandingFeaturedJobs(limit)
    }
    
    try {
      const res = await axiosClient.get('/landing/featured-jobs', {
        params: { limit },
      })
      return res.data?.data?.posts || res.data?.posts || []
    } catch (error) {
      console.error('Failed to fetch featured jobs:', error)
      return []
    }
  },
}
