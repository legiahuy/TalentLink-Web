import type { FeaturedUser, FeaturedJob } from '@/types/admin'

// Mock Featured Users Data
const mockFeaturedUsers: FeaturedUser[] = [
  {
    id: '71835d3b-5740-407b-9e46-a3449accb980',
    username: 'bonpaul',
    display_name: 'BON',
    avatar_url: '/images/auth/auth-photo-1.jpg',
    role: 'producer',
    brief_bio: 'Vietnamese DJ/Producer specializing in EDM and House music',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    genres: [
      { id: '1', name: 'EDM', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '2', name: 'House', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
    is_verified: true,
    is_featured: true,
    featured_at: '2024-12-20T10:30:00Z',
    created_at: '2024-11-25T15:10:44Z',
  },
  {
    id: 'a2b3c4d5-e6f7-8901-2345-6789abcdef01',
    username: 'minhanh_singer',
    display_name: 'Minh Anh',
    avatar_url: '/images/auth/auth-photo-1.jpg',
    role: 'singer',
    brief_bio: 'Professional vocalist specializing in Pop and Ballad',
    city: 'Hà Nội',
    country: 'Vietnam',
    genres: [
      { id: '3', name: 'Pop', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '4', name: 'Ballad', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
    is_verified: true,
    is_featured: true,
    featured_at: '2024-12-19T14:20:00Z',
    created_at: '2024-10-15T08:30:00Z',
  },
  {
    id: 'b3c4d5e6-f7a8-9012-3456-789abcdef012',
    username: 'tuananh_guitar',
    display_name: 'Tuấn Anh',
    avatar_url: '/images/auth/auth-photo-1.jpg',
    role: 'producer',
    brief_bio: 'Indie guitarist and music producer',
    city: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    genres: [
      { id: '5', name: 'Indie', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '6', name: 'Rock', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
    is_verified: false,
    is_featured: true,
    featured_at: '2024-12-18T09:15:00Z',
    created_at: '2024-09-20T12:00:00Z',
  },
  {
    id: 'c4d5e6f7-a8b9-0123-4567-89abcdef0123',
    username: 'thuha_violin',
    display_name: 'Thu Hà',
    avatar_url: '/images/auth/auth-photo-1.jpg',
    role: 'singer',
    brief_bio: 'Classical violinist with 10+ years experience',
    city: 'Hà Nội',
    country: 'Vietnam',
    genres: [
      { id: '7', name: 'Classical', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '8', name: 'Acoustic', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
    is_verified: true,
    is_featured: true,
    featured_at: '2024-12-17T16:45:00Z',
    created_at: '2024-08-10T10:20:00Z',
  },
  {
    id: 'd5e6f7a8-b9c0-1234-5678-9abcdef01234',
    username: 'djminh',
    display_name: 'DJ Minh',
    avatar_url: '/images/auth/auth-photo-1.jpg',
    role: 'producer',
    brief_bio: 'Professional DJ for events and clubs',
    city: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    genres: [
      { id: '1', name: 'EDM', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '9', name: 'Techno', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
    is_verified: true,
    is_featured: true,
    featured_at: '2024-12-16T11:30:00Z',
    created_at: '2024-07-05T14:15:00Z',
  },
]

// Mock Featured Jobs Data
const mockFeaturedJobs: FeaturedJob[] = [
  {
    id: 'acb97ceb-ad3a-41e2-a8b9-a5ec8386',
    title: 'Looking for EDM Producer for Album',
    brief_description: 'Need experienced EDM producer for upcoming album project',
    description: 'We are looking for a talented EDM producer to collaborate on our new album. Must have experience with modern production techniques.',
    post_type: 'job_offer',
    type: 'producer',
    status: 'published',
    visibility: 'public',
    creator_id: 'creator-1',
    creator_role: 'venue',
    creator_name: 'Music Studio HCM',
    creator_username: 'musicstudio_hcm',
    creator_avatar: '/images/auth/auth-photo-1.jpg',
    location: 'Ho Chi Minh City',
    location_type: 'hybrid',
    budget_min: 5000000,
    budget_max: 15000000,
    budget_currency: 'VND',
    payment_type: 'byProject',
    experience_level: 'expert',
    required_skills: ['Ableton Live', 'FL Studio', 'Mixing', 'Mastering'],
    genres: ['EDM', 'House', 'Techno'],
    deadline: '2025-02-15',
    submission_deadline: '2025-01-31',
    created_at: '2024-12-15T10:00:00Z',
    updated_at: '2024-12-15T10:00:00Z',
    published_at: '2024-12-15T10:00:00Z',
    is_featured: true,
    featured_at: '2024-12-20T09:00:00Z',
    total_submissions: 12,
    views_count: 245,
  },
  {
    id: 'bcd98dfc-be4b-52f3-b9ca-b6fd9497',
    title: 'Singer Needed for Wedding Event',
    brief_description: 'Professional singer for wedding ceremony',
    description: 'Looking for a professional singer to perform at a wedding ceremony. Repertoire should include romantic ballads and pop songs.',
    post_type: 'gig',
    type: 'singer',
    status: 'published',
    visibility: 'public',
    creator_id: 'creator-2',
    creator_role: 'venue',
    creator_name: 'Grand Palace Hotel',
    creator_username: 'grandpalace_events',
    creator_avatar: '/images/auth/auth-photo-1.jpg',
    location: 'Hanoi',
    location_type: 'onsite',
    budget_min: 3000000,
    budget_max: 5000000,
    budget_currency: 'VND',
    payment_type: 'bySession',
    experience_level: 'intermediate',
    required_skills: ['Live Performance', 'Ballad', 'Pop'],
    genres: ['Pop', 'Ballad'],
    deadline: '2025-01-20',
    submission_deadline: '2025-01-15',
    created_at: '2024-12-14T14:30:00Z',
    updated_at: '2024-12-14T14:30:00Z',
    published_at: '2024-12-14T14:30:00Z',
    is_featured: true,
    featured_at: '2024-12-19T15:00:00Z',
    total_submissions: 8,
    views_count: 156,
  },
  {
    id: 'cde09efd-cf5c-63g4-c0db-c7ge0508',
    title: 'Music Producer for Indie Band',
    brief_description: 'Seeking producer for indie rock album',
    description: 'Our indie band is looking for a creative producer to help us record and produce our debut album.',
    post_type: 'job_offer',
    type: 'producer',
    status: 'published',
    visibility: 'public',
    creator_id: 'creator-3',
    creator_role: 'singer',
    creator_name: 'The Wanderers Band',
    creator_username: 'wanderers_band',
    creator_avatar: '/images/auth/auth-photo-1.jpg',
    location: 'Da Nang',
    location_type: 'onsite',
    budget_min: 10000000,
    budget_max: 20000000,
    budget_currency: 'VND',
    payment_type: 'byProject',
    experience_level: 'intermediate',
    required_skills: ['Recording', 'Mixing', 'Indie Production'],
    genres: ['Indie', 'Rock', 'Alternative'],
    deadline: '2025-03-01',
    submission_deadline: '2025-02-15',
    created_at: '2024-12-13T09:00:00Z',
    updated_at: '2024-12-13T09:00:00Z',
    published_at: '2024-12-13T09:00:00Z',
    is_featured: true,
    featured_at: '2024-12-18T12:00:00Z',
    total_submissions: 5,
    views_count: 189,
  },
]

// Additional non-featured users for search
const mockNonFeaturedUsers: FeaturedUser[] = [
  {
    id: 'e6f7a8b9-c0d1-2345-6789-0abcdef12345',
    username: 'linh_pianist',
    display_name: 'Linh Nguyễn',
    avatar_url: '/images/auth/auth-photo-1.jpg',
    role: 'singer',
    brief_bio: 'Classical pianist and composer',
    city: 'Hà Nội',
    country: 'Vietnam',
    genres: [
      { id: '7', name: 'Classical', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
    is_verified: false,
    is_featured: false,
    created_at: '2024-06-15T10:00:00Z',
  },
  {
    id: 'f7a8b9c0-d1e2-3456-7890-1bcdef234567',
    username: 'nam_rapper',
    display_name: 'Nam MC',
    avatar_url: '/images/auth/auth-photo-1.jpg',
    role: 'singer',
    brief_bio: 'Hip-hop artist and rapper',
    city: 'TP. Hồ Chí Minh',
    country: 'Vietnam',
    genres: [
      { id: '10', name: 'Hip-Hop', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '11', name: 'Rap', created_at: '2024-01-01', updated_at: '2024-01-01' },
    ],
    is_verified: true,
    is_featured: false,
    created_at: '2024-05-20T12:00:00Z',
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAdminData = {
  // Get featured users with pagination
  getFeaturedUsers: async (limit = 50, offset = 0) => {
    await delay(300) // Simulate network delay
    const start = offset
    const end = offset + limit
    const users = mockFeaturedUsers.slice(start, end)

    return {
      data: {
        users,
        total: mockFeaturedUsers.length,
        limit,
        offset,
      },
    }
  },

  // Get featured jobs with pagination
  getFeaturedJobs: async (limit = 50, offset = 0) => {
    await delay(300)
    const start = offset
    const end = offset + limit
    const posts = mockFeaturedJobs.slice(start, end)

    return {
      data: {
        posts,
        total: mockFeaturedJobs.length,
        limit,
        offset,
      },
    }
  },

  // Feature a user
  featureUser: async (userId: string) => {
    await delay(200)
    const user = mockNonFeaturedUsers.find((u) => u.id === userId)
    if (user) {
      user.is_featured = true
      user.featured_at = new Date().toISOString()
      mockFeaturedUsers.push(user)
      const index = mockNonFeaturedUsers.findIndex((u) => u.id === userId)
      if (index > -1) mockNonFeaturedUsers.splice(index, 1)
    }
    return { message: 'User featured successfully' }
  },

  // Unfeature a user
  unfeatureUser: async (userId: string) => {
    await delay(200)
    const user = mockFeaturedUsers.find((u) => u.id === userId)
    if (user) {
      user.is_featured = false
      user.featured_at = undefined
      mockNonFeaturedUsers.push(user)
      const index = mockFeaturedUsers.findIndex((u) => u.id === userId)
      if (index > -1) mockFeaturedUsers.splice(index, 1)
    }
    return { message: 'User unfeatured successfully' }
  },

  // Feature a job
  featureJob: async (jobId: string) => {
    await delay(200)
    // In real implementation, would update the job in the list
    return { message: 'Job featured successfully' }
  },

  // Unfeature a job
  unfeatureJob: async (jobId: string) => {
    await delay(200)
    // In real implementation, would update the job in the list
    return { message: 'Job unfeatured successfully' }
  },

  // Search users (for featuring)
  searchUsers: async (query: string) => {
    await delay(300)
    const allUsers = [...mockFeaturedUsers, ...mockNonFeaturedUsers]
    const filtered = allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.display_name.toLowerCase().includes(query.toLowerCase())
    )
    return filtered
  },

  // Search jobs (for featuring)
  searchJobs: async (query: string) => {
    await delay(300)
    const allJobs = mockFeaturedJobs // In real app, would include non-featured jobs
    const filtered = allJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(query.toLowerCase()) ||
        j.description?.toLowerCase().includes(query.toLowerCase()) ||
        j.brief_description?.toLowerCase().includes(query.toLowerCase())
    )
    return filtered
  },

  // Get all mock data for landing page
  getLandingFeaturedUsers: async (limit = 10) => {
    await delay(200)
    return mockFeaturedUsers.slice(0, limit)
  },

  getLandingFeaturedJobs: async (limit = 10) => {
    await delay(200)
    return mockFeaturedJobs.slice(0, limit)
  },
}
