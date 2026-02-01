import { getTranslations } from 'next-intl/server'
import { landingService } from '@/services/landingService'
import LandingPageClient, { ArtistData } from './LandingPageClient'
import { JobPost } from '@/types/job'
import { FeaturedUser } from '@/types/admin'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TalentLink - Connect with Top Talent & Opportunities',
  description: 'Find the best artists, venues, and creative jobs. Join TalentLink today to showcase your portfolio or hire top talent.',
}

export default async function LandingPage() {
  const tCommon = await getTranslations('Common')

  let featuredArtists: ArtistData[] = []
  let featuredJobs: JobPost[] = []

  try {
    const [users, jobs] = await Promise.all([
      landingService.getFeaturedUsers(4),
      landingService.getFeaturedJobs(3),
    ])

    // Transform FeaturedUser to ArtistData format
    featuredArtists = users.map((user: FeaturedUser) => ({
      id: user.id,
      name: user.display_name || tCommon('unknown'),
      username: user.username || user.id,
      image: user.avatar_url || '/images/artist/default-avatar.jpeg',
      genres: user.genres?.map((g) => g.name) || [],
      location: [user.city, user.country].filter(Boolean).join(', ') || tCommon('unknown'),
      description: user.brief_bio || '',
      role: user.role || 'artist',
    }))

    // Transform FeaturedJob to JobPost format
    featuredJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      description: job.description || '',
      brief_description: job.brief_description,
      post_type: job.post_type,
      type: job.type,
      status: job.status,
      visibility: job.visibility,
      creator_id: job.creator_id,
      creator_role: job.creator_role,
      // Robust mapping for creator info - try all possible field names
      creator_display_name: job.creatorName ?? job.creator_name ?? job.creatorDisplayName ?? job.creator_display_name ?? tCommon('unknown'),
      creator_username: job.creatorUsername ?? job.creator_username,
      creator_avatar: job.creatorAvatarUrl ?? job.creator_avatar_url ?? job.creatorAvatar ?? job.creator_avatar,
      location: job.location,
      location_type: job.location_type,
      budget_min: job.budget_min,
      budget_max: job.budget_max,
      budget_currency: job.budget_currency,
      payment_type: job.payment_type,
      experience_level: job.experience_level,
      required_skills: job.required_skills,
      genres: job.genres,
      deadline: job.deadline,
      created_at: job.created_at,
      updated_at: job.updated_at,
      published_at: job.published_at,
      applications_count: job.total_submissions,
      views_count: job.views_count
    }))

  } catch (error) {
    console.error('Failed to fetch featured content:', error)
    // Fallback to empty arrays
  }

  return (
    <LandingPageClient 
      artists={featuredArtists} 
      jobs={featuredJobs} 
    />
  )
}
