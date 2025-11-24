export interface Job {
  id: string
  title: string
  company: string
  companyLogo: string
  type: string
  location: string
  salary: string
  postedDate: string
  genres: string[]
  description: string
  requirements: string[]
  benefits?: string[]
  schedule?: string
  employmentType?: 'one_time' | 'part_time' | 'full_time' | 'contract'
  experienceLevel?: 'entry' | 'intermediate' | 'expert'
  applicationDeadline?: string
  contactEmail?: string
  contactPhone?: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: 'VND' | 'USD'
  salaryPeriod?: 'per_show' | 'per_hour' | 'per_month' | 'per_project'
  salaryNegotiable?: boolean
}

export type JobType = 'all' | 'artist' | 'venue' | 'saved'
