import { getTranslations } from 'next-intl/server'
import { jobService } from '@/services/jobService'
import JobPoolClient from './JobPoolClient'
import { JobSearchRequest, JobPost } from '@/types/job'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Jobs',
  description: 'Browse the latest creative jobs, auditions, and gigs. Find your next opportunity in the entertainment industry on TalentLink.',
}

export default async function JobPoolPage() {
  const t = await getTranslations('JobPool')
  
  // Initial fetch server-side
  let initialJobs: JobPost[] = []

  try {
    const initialRequest: JobSearchRequest = {
        query: undefined,
        status: 'published',
        isActive: true,
        page: 1,
        pageSize: 20,
        sortBy: 'created_at',
        sortOrder: 'asc',
    }

    const searchResult = await jobService.searchJobsAdvanced(initialRequest)
    
    // Transform data logic (duplicated from client for consistency)
    initialJobs = searchResult.jobPosts.map((job: any) => ({
        id: job.id,
        title: job.title,
        description: job.description ?? job.briefDescription ?? job.brief_description ?? '',
        brief_description: job.briefDescription ?? job.brief_description,
        post_type: (job.postType ?? job.post_type) as 'job_offer' | 'gig' | 'availability',
        type: job.type as 'producer' | 'singer' | 'venue' | undefined,
        status: job.status as 'draft' | 'published' | 'closed' | 'completed' | 'cancelled',
        visibility: job.visibility as 'public' | 'private' | 'invite_only',
        creator_id: job.creatorId ?? job.creator_id,
        creator_role: job.creatorRole ?? job.creator_role,
        creator_display_name: job.creatorDisplayName ?? job.creator_display_name,
        creator_username: job.creatorUsername ?? job.creator_username,
        creator_avatar: job.creatorAvatarUrl ?? job.creator_avatar_url,
        location: job.location || job.locationText || job.location_text,
        location_type: (job.locationType ?? job.location_type) as 'remote' | 'onsite' | 'hybrid' | undefined,
        budget_min: job.budgetMin ?? job.budget_min,
        budget_max: job.budgetMax ?? job.budget_max,
        budget_currency: (job.budgetCurrency ?? job.budget_currency) as 'USD' | 'EUR' | 'JPY' | 'VND' | undefined,
        payment_type: (job.paymentType ?? job.payment_type) as
          | 'bySession'
          | 'byHour'
          | 'byProject'
          | 'byMonth'
          | undefined,
        recruitment_type: (job.recruitmentType ?? job.recruitment_type) as
          | 'full_time'
          | 'part_time'
          | 'contract'
          | 'one_time'
          | undefined,
        experience_level: (job.experienceLevel ?? job.experience_level) as
          | 'beginner'
          | 'intermediate'
          | 'expert'
          | 'any'
          | undefined,
        required_skills: job.requiredSkills ?? job.required_skills,
        genres: job.genres,
        benefits: job.benefits,
        submission_deadline: job.deadline ?? job.submission_deadline ?? undefined,
        created_at: job.createdAt ?? job.created_at,
        updated_at: job.updatedAt ?? job.updated_at,
        published_at: job.publishedAt ?? job.published_at ?? undefined,
        closed_at: job.closedAt ?? job.closed_at ?? undefined,
        total_submissions: job.applicationsCount ?? job.applications_count ?? job.total_submissions,
        applications_count: job.applicationsCount ?? job.applications_count,
        bookings_count: job.bookingsCount ?? job.bookings_count,
        views_count: job.viewsCount ?? job.views_count,
        is_deadline_passed: job.isDeadlinePassed ?? job.is_deadline_passed,
        can_accept_submissions: job.canAcceptSubmissions ?? job.can_accept_submissions,
      }))
    
  } catch (error) {
    console.error('Failed to fetch initial jobs:', error)
    // Render with empty list if fetch fails
  }

  return (
    <JobPoolClient initialJobs={initialJobs} />
  )
}
