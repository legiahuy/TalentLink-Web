'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Loader,
  ArrowLeft,
  Bookmark,
  Share2,
  Send,
  MessageCircle,
  BookmarkCheck,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { MapPin, DollarSign, Calendar, Briefcase } from 'lucide-react'
import type { JobPost, MySubmissionsResponse, MySubmissionItem } from '@/types/job'
import ApplicationDialog from '@/components/jobs/ApplicationDialog'
import { jobService } from '@/services/jobService'
import { resolveMediaUrl } from '@/lib/utils'
import Link from 'next/link'

interface JobWithCreator extends JobPost {
  creator_display_name?: string
  creator_avatar_url?: string
  creator_username?: string
}

const SAVED_JOBS_KEY = 'talentlink_saved_jobs'

const JobDetailPage = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const jobId = params?.id ?? ''

  const [job, setJob] = useState<JobWithCreator | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_JOBS_KEY)
    if (saved) {
      try {
        const savedJobs = new Set(JSON.parse(saved))
        setIsSaved(savedJobs.has(jobId))
      } catch (e) {
        console.error('Failed to load saved jobs', e)
      }
    }
  }, [jobId])

  // Toggle save job
  const toggleSave = () => {
    const saved = localStorage.getItem(SAVED_JOBS_KEY)
    const savedJobs = saved ? new Set(JSON.parse(saved)) : new Set<string>()

    if (isSaved) {
      savedJobs.delete(jobId)
    } else {
      savedJobs.add(jobId)
    }

    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(Array.from(savedJobs)))
    setIsSaved(!isSaved)
  }

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
        // Fetch job data from API
        const jobData = await jobService.getJobById(jobId, 'assets,tags')

        if (!active) return

        if (!jobData) {
          setError('Job not found')
          return
        }

        // Backend already returns creator_name, creator_username, creator_avatar
        setJob(jobData)

        // Check if user has already applied
        try {
          const mySubmissions = await jobService.getMySubmissions()
          const myApplication = mySubmissions.submissions?.find((sub) => sub.job?.id === jobId)
          if (myApplication) {
            setHasApplied(true)
            setApplicationStatus(myApplication.status)
          }
        } catch (err) {
          // Silently fail - user might not be logged in
          console.error('Failed to check application status', err)
        }
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

  const formatSalary = (job: JobWithCreator) => {
    if (job.budget_min && job.budget_max && job.budget_currency && job.payment_type) {
      const formatNumber = (num: number) => {
        if (job.budget_currency === 'VND') {
          return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
          }).format(num)
        }
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: job.budget_currency,
          maximumFractionDigits: 0,
        }).format(num)
      }

      type PaymentType = NonNullable<JobWithCreator['payment_type']>
      const periodMap: Record<PaymentType, '/show' | '/hour' | '/project' | '/month'> = {
        bySession: '/show',
        byHour: '/hour',
        byProject: '/project',
        byMonth: '/month',
      }

      const paymentType = job.payment_type
      if (!paymentType) return ''

      const range = `${formatNumber(job.budget_min)} - ${formatNumber(job.budget_max)}`
      return `${range}${periodMap[paymentType]}${job.is_negotiable ? ' (Negotiable)' : ''}`
    }
    return ''
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
                    <button
                      onClick={() =>
                        job.creator_username && router.push(`/profile/${job.creator_username}`)
                      }
                      className="shrink-0 cursor-pointer"
                    >
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-border hover:border-primary transition-colors">
                        <AvatarImage
                          src={resolveMediaUrl(job.creator_avatar_url)}
                          alt={job.creator_display_name || 'Unknown'}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                          {(job.creator_display_name || 'Unknown')
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                    <div className="flex-1 text-center sm:text-left">
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{job.title}</h1>
                      <button
                        onClick={() =>
                          job.creator_username && router.push(`/profile/${job.creator_username}`)
                        }
                        className="text-lg text-muted-foreground font-medium hover:underline hover:text-primary transition-colors"
                      >
                        {job.creator_display_name || 'Unknown'}
                      </button>
                    </div>
                  </div>

                  {/* Job Meta */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    {job.type && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span>{job.type.charAt(0).toUpperCase() + job.type.slice(1)}</span>
                      </div>
                    )}
                    {job.recruitment_type && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">{job.recruitment_type.replace('_', ' ')}</span>
                      </div>
                    )}
                    {(job.location || job.location_type) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {job.location
                            ? job.location_type
                              ? `${job.location} (${job.location_type})`
                              : job.location
                            : job.location_type || 'Remote'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-primary">{formatSalary(job)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{getTimeAgo(job.created_at)}</span>
                    </div>
                  </div>

                  {/* Genres */}
                  {job.genres && job.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.genres.map((genre, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Description */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>

                  {/* Work Time / Schedule */}
                  {job.work_time && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">Schedule</h2>
                      <p className="text-foreground/80">{job.work_time}</p>
                    </div>
                  )}

                  {/* Required Skills */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                      <ul className="space-y-2">
                        {job.required_skills.map((skill, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span className="text-foreground/80">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="mb-6">
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

                  {/* Additional Info */}
                  {(job.experience_level ||
                    job.recruitment_type ||
                    job.deadline ||
                    job.submission_deadline) && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">Additional Information</h2>
                      <div className="space-y-2 text-sm">
                        {job.experience_level && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Experience Level:</span>
                            <span className="font-medium capitalize">{job.experience_level}</span>
                          </div>
                        )}
                        {job.recruitment_type && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Employment Type:</span>
                            <span className="font-medium capitalize">
                              {job.recruitment_type.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                        {job.deadline && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Project Deadline:</span>
                            <span className="font-medium">
                              {new Date(job.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {job.submission_deadline && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Application Deadline:</span>
                            <span className="font-medium">
                              {new Date(job.submission_deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24 shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  {hasApplied ? (
                    <div className="space-y-2">
                      <div className="w-full bg-muted/50 border rounded-lg p-4 text-center hidden sm:block">
                        <p className="text-sm font-medium mb-2">Application Status</p>
                        <Badge
                          variant={
                            applicationStatus === 'accepted'
                              ? 'default'
                              : applicationStatus === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                          className="text-sm"
                        >
                          {(() => {
                            const status = applicationStatus || 'applied'
                            if (status === 'pending_review') return 'Pending Review'
                            if (status === 'under_review') return 'Under Review'
                            if (status === 'accepted') return 'Accepted'
                            if (status === 'rejected') return 'Rejected'
                            return (
                              status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
                            )
                          })()}
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full hidden sm:flex" size="lg" asChild>
                        <Link href="/jobs/my-applications">View My Applications</Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 hidden sm:flex"
                      size="lg"
                      onClick={() => setIsApplicationOpen(true)}
                      disabled={job?.status !== 'published' || job?.is_deadline_passed}
                    >
                      Apply Now
                    </Button>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={toggleSave}>
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 mr-2 text-primary fill-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4 mr-2" />
                      )}
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: job.title,
                            text: job.brief_description || job.description,
                            url: window.location.href,
                          })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          // Add toast notification here if you have toast
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {job.status && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Status</h3>
                        <Badge variant={job.status === 'published' ? 'default' : 'secondary'}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </div>
                    </>
                  )}

                  {(job.total_submissions !== undefined ||
                    job.applications_count !== undefined) && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Applications</h3>
                        <p className="text-2xl font-bold">
                          {job.total_submissions || job.applications_count || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Total applications received</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="text-sm text-muted-foreground">
                    <p>
                      Posted{' '}
                      {new Date(job.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {job.updated_at && job.updated_at !== job.created_at && (
                      <p className="mt-1">Updated {getTimeAgo(job.updated_at)}</p>
                    )}
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
          {hasApplied ? (
            <Button variant="outline" className="flex-1 h-12" asChild>
              <Link href="/jobs/my-applications">
                <FileText className="w-4 h-4 mr-2" />
                View Application
              </Link>
            </Button>
          ) : (
            <Button
              className="flex-1 h-12 bg-primary hover:bg-primary/90"
              onClick={() => setIsApplicationOpen(true)}
              disabled={job?.status !== 'published' || job?.is_deadline_passed}
            >
              <Send className="w-4 h-4 mr-2" />
              Apply
            </Button>
          )}
          <Button variant="outline" className="flex-1 h-12">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </div>

      {job && (
        <ApplicationDialog
          open={isApplicationOpen}
          onOpenChange={(open) => {
            setIsApplicationOpen(open)
            if (!open) {
              // Refresh application status after dialog closes
              const checkApplication = async () => {
                try {
                  const mySubmissions: MySubmissionsResponse = await jobService.getMySubmissions()
                  const myApplication = mySubmissions.submissions.find(
                    (sub: MySubmissionItem) => sub.job?.id === jobId,
                  )
                  if (myApplication) {
                    setHasApplied(true)
                    setApplicationStatus(myApplication.status)
                  }
                } catch (err) {
                  // Silently fail
                  console.error('Failed to check application status', err)
                }
              }
              checkApplication()
            }
          }}
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.creator_name || 'Unknown'}
        />
      )}
    </div>
  )
}

export default JobDetailPage
