'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader, ArrowLeft, Bookmark, Share2, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { MapPin, DollarSign, Calendar, Briefcase } from 'lucide-react'
import type { Job } from '@/types/job'
import ApplicationDialog from '@/components/jobs/ApplicationDialog'

// Mock data - moved outside component to avoid Date.now() in render
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Acoustic Singer for Weekend Night',
    company: 'Acoustic Cafe & Bar',
    companyLogo:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=200&h=200&fit=crop',
    type: 'Singer',
    location: 'District 1, Ho Chi Minh City',
    salary: '$150-250/show',
    postedDate: '2025-01-13T10:00:00Z',
    genres: ['Acoustic', 'Pop'],
    description:
      'Looking for a warm-voiced singer suitable for acoustic spaces. Performance duration: 2 hours per show. You will create a relaxing and cozy atmosphere for our customers.',
    requirements: [
      'Minimum 1 year of performance experience',
      'Having your own music set is a plus',
      'Good communication skills with the audience',
      'Diverse repertoire of acoustic songs',
    ],
    benefits: [
      'Friendly and professional working environment',
      'Networking opportunities with other artists',
      'Promotion on venue social media channels',
      'Tips from customers',
    ],
    schedule: 'Friday, Saturday, Sunday (8:00 PM - 10:00 PM)',
    employmentType: 'part_time',
    experienceLevel: 'intermediate',
    applicationDeadline: '2025-11-30',
    contactEmail: 'booking@acousticcafe.vn',
    contactPhone: '+84 901 234 567',
    salaryMin: 3000000,
    salaryMax: 5000000,
    salaryCurrency: 'VND',
    salaryPeriod: 'per_show',
    salaryNegotiable: true,
  },
  {
    id: '2',
    title: 'Rock Band for Event Series',
    company: 'Rock Arena',
    companyLogo:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    type: 'Band',
    location: 'District 3, Ho Chi Minh City',
    salary: '$750-1,250/show',
    postedDate: '2025-01-11T10:00:00Z',
    genres: ['Rock', 'Metal'],
    description: 'Seeking professional rock band for a series of 5 events over the next 2 months.',
    requirements: [
      'Complete music set required',
      'Experience performing at large venues',
      'Original songs are a plus',
    ],
    benefits: [
      'High exposure at major events',
      'Professional sound system provided',
      'Competitive compensation',
    ],
    employmentType: 'contract',
    experienceLevel: 'expert',
    contactEmail: 'events@rockarena.vn',
    contactPhone: '+84 902 345 678',
  },
  {
    id: '3',
    title: 'Jazz Guitarist for Night Performance',
    company: 'Blue Note Jazz Club',
    companyLogo:
      'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200&h=200&fit=crop',
    type: 'Musician',
    location: 'District 2, Ho Chi Minh City',
    salary: '$100-200/show',
    postedDate: '2025-01-09T10:00:00Z',
    genres: ['Jazz', 'Blues'],
    description:
      'Need a jazz-savvy guitarist to join the venue house band. Must be able to read music and improvise well.',
    requirements: ['Proficient in jazz guitar', 'Ability to read music and improvise'],
    benefits: ['Regular weekly gigs', 'Collaboration with professional musicians'],
    employmentType: 'part_time',
    experienceLevel: 'intermediate',
    contactEmail: 'booking@bluenote.vn',
  },
  {
    id: '4',
    title: 'DJ for Grand Opening Event',
    company: 'The Lounge Bar',
    companyLogo:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop',
    type: 'DJ',
    location: 'District 7, Ho Chi Minh City',
    salary: '$500-750/event',
    postedDate: '2025-01-06T10:00:00Z',
    genres: ['EDM', 'House'],
    description:
      'Looking for an experienced DJ for bar grand opening. Expected attendance: 300+ guests.',
    requirements: [
      'Own equipment required',
      'Experience mixing for large events',
      'Having a fanbase is a plus',
    ],
    benefits: ['High-profile event', 'Media coverage', 'Networking opportunities'],
    employmentType: 'one_time',
    experienceLevel: 'expert',
    contactEmail: 'events@thelounge.vn',
    contactPhone: '+84 903 456 789',
  },
]

const JobDetailPage = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const jobId = params?.id ?? ''

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    let active = true

    if (!jobId) {
      setError('Invalid job ID')
      setLoading(false)
      return
    }

    const loadJob = async () => {
      setLoading(true)
      setError(null)
      try {
        // TODO: Replace with actual API call
        // const jobData = await jobService.getJobById(jobId)

        // Temporary: Find job from mock data
        const jobData = MOCK_JOBS.find((j) => j.id === jobId)

        if (!active) return

        if (!jobData) {
          setError('Job not found')
          return
        }

        setJob(jobData)
      } catch (e) {
        console.error('Error loading job', e)
        if (!active) return
        const message = e instanceof Error ? e.message : 'Unable to load job details'
        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadJob()
    return () => {
      active = false
    }
  }, [jobId])

  // Set page title dynamically
  useEffect(() => {
    if (job) {
      document.title = `${job.title} | TalentLink`
    }
  }, [job])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30)
      return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) !== 1 ? 's' : ''} ago`
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) !== 1 ? 's' : ''} ago`
  }

  const formatSalary = (job: Job) => {
    if (job.salaryMin && job.salaryMax && job.salaryCurrency && job.salaryPeriod) {
      const formatNumber = (num: number) => {
        if (job.salaryCurrency === 'VND') {
          return `$${(num / 1000000).toFixed(1)}M`
        }
        return `$${num.toLocaleString()}`
      }

      const periodMap = {
        per_show: '/show',
        per_hour: '/hour',
        per_month: '/month',
        per_project: '/project',
      }

      const range = `${formatNumber(job.salaryMin)} - ${formatNumber(job.salaryMax)}`
      return `${range}${periodMap[job.salaryPeriod]}${job.salaryNegotiable ? ' (Negotiable)' : ''}`
    }
    return job.salary
  }

  const employmentTypeMap = {
    one_time: 'One-time',
    part_time: 'Part-time',
    full_time: 'Full-time',
    contract: 'Contract',
  }

  const experienceLevelMap = {
    entry: 'Entry Level',
    intermediate: 'Intermediate',
    expert: 'Expert',
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center">
        <Loader className="animate-spin" size={24} />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-[70vh] w-full relative flex items-center justify-center">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6">
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl font-bold">Job Not Found</h2>
            <p className="text-muted-foreground">
              {error || 'The job you are looking for does not exist.'}
            </p>
            <Button onClick={() => router.push('/jobs')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Full-width background wrapper */}
      <div className="w-full min-h-screen bg-linear-to-br from-muted/50 via-muted/30 to-muted/40 relative">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        {/* Decorative blur orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 pt-24 pb-8 md:pt-28 md:pb-10 relative z-10">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  {/* Company Header */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center sm:items-start">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg shrink-0 border-2 border-border">
                      <AvatarImage src={job.companyLogo} alt={job.company} />
                      <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                        {job.company
                          .split(' ')
                          .map((word) => word[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{job.title}</h1>
                      <p className="text-lg text-muted-foreground font-medium">{job.company}</p>
                    </div>
                  </div>

                  {/* Job Meta */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-primary">{formatSalary(job)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{getTimeAgo(job.postedDate)}</span>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.genres.map((genre, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Description */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                    <p className="text-foreground/80 leading-relaxed">{job.description}</p>
                  </div>

                  {/* Schedule */}
                  {job.schedule && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">Schedule</h2>
                      <p className="text-foreground/80">{job.schedule}</p>
                    </div>
                  )}

                  {/* Requirements */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span className="text-foreground/80">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Benefits</h2>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">✓</span>
                            <span className="text-foreground/80">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24 shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 hidden sm:flex"
                    size="lg"
                    onClick={() => setIsApplicationOpen(true)}
                  >
                    Apply Now
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-2 ${isSaved ? 'fill-primary text-primary' : ''}`}
                      />
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      {job.contactPhone && (
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{job.contactPhone}</p>
                        </div>
                      )}
                      {job.contactEmail && (
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{job.contactEmail}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Job Details</h3>
                    <div className="space-y-2 text-sm">
                      {job.employmentType && (
                        <div>
                          <span className="text-muted-foreground">Employment Type:</span>
                          <p className="font-medium">{employmentTypeMap[job.employmentType]}</p>
                        </div>
                      )}
                      {job.experienceLevel && (
                        <div>
                          <span className="text-muted-foreground">Experience Level:</span>
                          <p className="font-medium">{experienceLevelMap[job.experienceLevel]}</p>
                        </div>
                      )}
                      {job.applicationDeadline && (
                        <div>
                          <span className="text-muted-foreground">Application Deadline:</span>
                          <p className="font-medium">
                            {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground pt-2">
                    <p>
                      Posted{' '}
                      {new Date(job.postedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Actions */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50 shadow-lg">
        <div className="flex gap-2">
          <Button
            className="flex-1 h-12 bg-primary hover:bg-primary/90"
            onClick={() => setIsApplicationOpen(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Apply
          </Button>
          <Button variant="outline" className="flex-1 h-12">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </div>

      {job && (
        <ApplicationDialog
          open={isApplicationOpen}
          onOpenChange={setIsApplicationOpen}
          jobTitle={job.title}
          companyName={job.company}
        />
      )}
    </div>
  )
}

export default JobDetailPage
