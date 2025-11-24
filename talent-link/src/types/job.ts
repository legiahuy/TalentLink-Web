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
}

export type JobType = 'all' | 'artist' | 'venue' | 'saved'
