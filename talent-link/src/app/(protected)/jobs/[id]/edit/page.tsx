'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Save, X, AlertTriangle } from 'lucide-react'

import { jobService } from '@/services/jobService'
import { userService } from '@/services/userService'
import type { Genre } from '@/types/user'
import type { UpdateJobPostRequest, JobPost } from '@/types/job'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type PostTypeValue = NonNullable<UpdateJobPostRequest['post_type']>
type RoleTypeValue = NonNullable<UpdateJobPostRequest['type']>
type RecruitmentTypeValue = NonNullable<UpdateJobPostRequest['recruitment_type']>
type ExperienceLevelValue = NonNullable<UpdateJobPostRequest['experience_level']>
type PaymentTypeValue = NonNullable<UpdateJobPostRequest['payment_type']>
type StatusValue = NonNullable<UpdateJobPostRequest['status']>

const ROLE_OPTIONS: { label: string; value: RoleTypeValue }[] = [
  { label: 'Producer', value: 'producer' },
  { label: 'Singer', value: 'singer' },
  { label: 'venue', value: 'venue' },
]

const POST_TYPES: { label: string; value: PostTypeValue }[] = [
  { label: 'Job Offer', value: 'job_offer' },
  { label: 'Gig / One-off', value: 'gig' },
  { label: 'Talent Availability', value: 'availability' },
]

const EMPLOYMENT_TYPES: { label: string; value: RecruitmentTypeValue }[] = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'One Time', value: 'one_time' },
]

const EXPERIENCE_LEVELS: { label: string; value: ExperienceLevelValue }[] = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expert', value: 'expert' },
  { label: 'Any experience', value: 'any' },
]

const PAYMENT_TYPES: { label: string; value: PaymentTypeValue }[] = [
  { label: 'Per Show', value: 'bySession' },
  { label: 'Per Hour', value: 'byHour' },
  { label: 'Per Project', value: 'byProject' },
  { label: 'Per Month', value: 'byMonth' },
]

const STATUS_OPTIONS: { label: string; value: StatusValue }[] = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Closed', value: 'closed' },
]

const defaultCurrency: NonNullable<UpdateJobPostRequest['budget_currency']> = 'VND'

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return ''
  // Parse from backend format dd-mm-yyyy to YYYY-MM-DD (for date input)
  // dateString format: "12-12-2025" -> "2025-12-12"
  const parts = dateString.split('-')
  if (parts.length === 3) {
    const [day, month, year] = parts
    // Validate and format
    if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
      return `${year}-${month}-${day}`
    }
  }
  // Fallback: try to parse as ISO date
  const date = new Date(dateString)
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]
  }
  return ''
}

const formatDeadline = (dateString: string): string => {
  if (!dateString) return ''
  // Convert YYYY-MM-DD (from date input) to dd-mm-yyyy (backend format)
  // dateString format: "2025-12-12" -> "12-12-2025"
  const [year, month, day] = dateString.split('-')
  return `${day}-${month}-${year}`
}

const JobEditPage = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const jobId = params?.id ?? ''

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [job, setJob] = useState<JobPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [postType, setPostType] = useState<PostTypeValue>('job_offer')
  const [roleType, setRoleType] = useState<RoleTypeValue>('producer')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState<RecruitmentTypeValue>('full_time')
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevelValue>('any')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [salaryCurrency, setSalaryCurrency] =
    useState<NonNullable<UpdateJobPostRequest['budget_currency']>>(defaultCurrency)
  const [salaryPeriod, setSalaryPeriod] = useState<PaymentTypeValue>('bySession')
  const [salaryNegotiable, setSalaryNegotiable] = useState(false)
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState<string[]>([])
  const [currentRequirement, setCurrentRequirement] = useState('')
  const [benefits, setBenefits] = useState<string[]>([])
  const [currentBenefit, setCurrentBenefit] = useState('')
  const [schedule, setSchedule] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [autoNotify, setAutoNotify] = useState(false)
  const [status, setStatus] = useState<StatusValue>('published')

  const [genres, setGenres] = useState<Genre[]>([])
  const [loadingGenres, setLoadingGenres] = useState(true)

  // Load job data
  useEffect(() => {
    let active = true

    const loadJob = async () => {
      if (!jobId) {
        setError('Invalid job ID')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Load genres
        const genresRes = await userService.getGenres()
        if (active) setGenres(genresRes)
        setLoadingGenres(false)

        // Load job data
        const jobData = await jobService.getJobById(jobId)

        if (!active) return

        if (!jobData) {
          setError('Job not found')
          return
        }

        setJob(jobData)

        // Pre-fill form
        setTitle(jobData.title || '')
        setSummary(jobData.brief_description || '')
        setPostType(jobData.post_type || 'job_offer')
        setRoleType(jobData.type || 'producer')
        setLocation(jobData.location || '')
        setEmploymentType(jobData.recruitment_type || 'full_time')
        setExperienceLevel(jobData.experience_level || 'any')
        setSalaryMin(jobData.budget_min?.toString() || '')
        setSalaryMax(jobData.budget_max?.toString() || '')
        setSalaryCurrency(jobData.budget_currency || defaultCurrency)
        setSalaryPeriod(jobData.payment_type || 'bySession')
        setSalaryNegotiable(jobData.is_negotiable || false)
        setDescription(jobData.description || '')
        setRequirements(jobData.required_skills || [])
        setBenefits(jobData.benefits || [])
        setSchedule(jobData.work_time || '')
        setDeadline(formatDateForInput(jobData.submission_deadline))
        setSelectedGenres(jobData.genres || [])
        setAutoNotify(jobData.auto_notify || false)
        setStatus(jobData.status || 'published')
      } catch (e) {
        console.error('Error loading job', e)
        if (!active) return
        const message = e instanceof Error ? e.message : 'Unable to load job details'
        setError(message)
        toast.error(message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadJob()
    return () => {
      active = false
    }
  }, [jobId])

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false
    if (!location.trim()) return false
    if (!description.trim() || description.trim().length < 20) return false
    if (!salaryMin) return false
    if (!salaryPeriod) return false
    if (selectedGenres.length === 0) return false
    return true
  }, [title, location, description, salaryMin, salaryPeriod, selectedGenres])

  const isClosed = job?.status === 'closed'
  const hasApplications = (job?.total_submissions ?? 0) > 0 || (job?.applications_count ?? 0) > 0

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setRequirements((prev) => [...prev, currentRequirement.trim()])
      setCurrentRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index))
  }

  const addBenefit = () => {
    if (currentBenefit.trim()) {
      setBenefits((prev) => [...prev, currentBenefit.trim()])
      setCurrentBenefit('')
    }
  }

  const removeBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre],
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      if (description.trim().length < 20) {
        toast.error('Description must be at least 20 characters.')
      } else {
        toast.error('Please fill in all required fields.')
      }
      return
    }
    if (isClosed) {
      toast.error('Cannot edit a closed job.')
      return
    }
    setSubmitting(true)
    try {
      const payload: UpdateJobPostRequest = {
        title: title.trim(),
        brief_description: summary.trim() || undefined,
        description: description.trim(),
        post_type: postType,
        type: roleType,
        location: location.trim(),
        recruitment_type: employmentType,
        experience_level: experienceLevel,
        budget_min: salaryMin ? Number(salaryMin) : undefined,
        budget_max: salaryMax ? Number(salaryMax) : undefined,
        budget_currency: salaryCurrency,
        payment_type: salaryPeriod,
        is_negotiable: salaryNegotiable,
        work_time: schedule.trim() || undefined,
        submission_deadline: deadline ? formatDeadline(deadline) : undefined,
        required_skills: requirements.length ? requirements : undefined,
        benefits: benefits.length ? benefits : undefined,
        genres: selectedGenres,
        auto_notify: autoNotify,
        status,
        visibility: 'public',
      }

      await jobService.updateJob(jobId, payload)
      toast.success('Job updated successfully!')
      router.push(`/jobs/${jobId}`)
    } catch (error) {
      console.error('Failed to update job', error)
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update job posting. Please try again later.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-24">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen relative">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-24">
          <Card>
            <CardContent className="p-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error || 'The job you are looking for does not exist.'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/jobs/my-posts">Back to My Jobs</Link>
                </Button>
                <Button asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <section className="relative border-b pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-linear-to-br from-primary/15 via-primary/8 to-primary/5">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-transparent animate-pulse" />
        <div
          className="absolute inset-0 opacity-30 animate-[gridMove_8s_linear_infinite]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-20 w-52 h-52 bg-primary/25 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-10 left-1/3 w-44 h-44 bg-primary/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1320px] px-4 md:px-6 z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4 text-foreground">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Edit Job Post</h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                  Update your job posting details. Changes will be reflected immediately.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="outline" size="lg" asChild>
                <Link href={`/jobs/${jobId}`}>View Job</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-linear-to-br from-muted/50 via-muted/30 to-muted/40 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-8 md:py-12 relative z-10">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {isClosed && (
            <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Job is Closed</AlertTitle>
              <AlertDescription>
                This job has been closed and cannot be edited. You can still view it, but changes
                are not allowed.
              </AlertDescription>
            </Alert>
          )}

          {hasApplications && !isClosed && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Active Applications</AlertTitle>
              <AlertDescription>
                This job has {job.total_submissions || job.applications_count || 0} application(s).
                Editing may affect existing applications. Please review carefully.
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-lg border-border/50 bg-card/70 backdrop-blur-sm">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-2xl font-semibold">Job Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete the form below. Fields marked with * are required.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g. Acoustic singer for Friday night residency"
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                          required
                          disabled={isClosed}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="summary">Short summary</Label>
                        <Input
                          id="summary"
                          placeholder="One sentence overview that appears in listings"
                          value={summary}
                          onChange={(event) => setSummary(event.target.value)}
                          disabled={isClosed}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Job description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Share responsibilities, expectations, stage setup, and how artists will collaborate with your venue."
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={8}
                        required
                        minLength={20}
                        disabled={isClosed}
                      />
                      {description.trim().length > 0 && description.trim().length < 20 && (
                        <p className="text-xs text-destructive">
                          Description must be at least 20 characters ({description.trim().length}
                          /20)
                        </p>
                      )}
                      {description.trim().length >= 20 && (
                        <p className="text-xs text-muted-foreground">
                          {description.trim().length} characters
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="schedule">Schedule / time commitment</Label>
                        <Input
                          id="schedule"
                          placeholder="Every Friday, 8 PM - 10 PM"
                          value={schedule}
                          onChange={(event) => setSchedule(event.target.value)}
                          disabled={isClosed}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Application deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={deadline}
                          onChange={(event) => setDeadline(event.target.value)}
                          disabled={isClosed}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Key requirements</Label>
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Input
                          placeholder="e.g. Minimum 2 years of live performance experience"
                          value={currentRequirement}
                          onChange={(event) => setCurrentRequirement(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              addRequirement()
                            }
                          }}
                          disabled={isClosed}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addRequirement}
                          disabled={isClosed}
                        >
                          Add
                        </Button>
                      </div>
                      {requirements.length > 0 && (
                        <div className="space-y-2">
                          {requirements.map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className="flex items-start gap-2 rounded-md bg-muted/70 p-3"
                            >
                              <span className="text-primary">•</span>
                              <span className="flex-1 text-sm">{item}</span>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => removeRequirement(index)}
                                aria-label="Remove requirement"
                                disabled={isClosed}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Benefits</Label>
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Input
                          placeholder="e.g. Professional sound engineer provided"
                          value={currentBenefit}
                          onChange={(event) => setCurrentBenefit(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              addBenefit()
                            }
                          }}
                          disabled={isClosed}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addBenefit}
                          disabled={isClosed}
                        >
                          Add
                        </Button>
                      </div>
                      {benefits.length > 0 && (
                        <div className="space-y-2">
                          {benefits.map((item, index) => (
                            <div
                              key={`${item}-${index}`}
                              className="flex items-start gap-2 rounded-md bg-muted/70 p-3"
                            >
                              <span className="text-primary">•</span>
                              <span className="flex-1 text-sm">{item}</span>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={() => removeBenefit(index)}
                                aria-label="Remove benefit"
                                disabled={isClosed}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="postType">Opportunity type *</Label>
                        <Select
                          value={postType}
                          onValueChange={(value) => setPostType(value as typeof postType)}
                          disabled={isClosed}
                        >
                          <SelectTrigger id="postType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {POST_TYPES.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roleType">Talent profile *</Label>
                        <Select
                          value={roleType}
                          onValueChange={(value) => setRoleType(value as typeof roleType)}
                          disabled={isClosed}
                        >
                          <SelectTrigger id="roleType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="District 1, Ho Chi Minh City"
                          value={location}
                          onChange={(event) => setLocation(event.target.value)}
                          required
                          disabled={isClosed}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employmentType">Engagement type *</Label>
                        <Select
                          value={employmentType}
                          onValueChange={(value) =>
                            setEmploymentType(value as typeof employmentType)
                          }
                          disabled={isClosed}
                        >
                          <SelectTrigger id="employmentType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EMPLOYMENT_TYPES.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel">Experience level *</Label>
                        <Select
                          value={experienceLevel}
                          onValueChange={(value) =>
                            setExperienceLevel(value as typeof experienceLevel)
                          }
                          disabled={isClosed}
                        >
                          <SelectTrigger id="experienceLevel">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                          value={status}
                          onValueChange={(value) => setStatus(value as typeof status)}
                          disabled={isClosed}
                        >
                          <SelectTrigger id="status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Compensation *</Label>
                        <p className="text-sm text-muted-foreground">
                          Provide a range so artists can self-select quickly.
                        </p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="salaryMin">Minimum budget *</Label>
                          <Input
                            id="salaryMin"
                            type="number"
                            min={0}
                            placeholder="3000000"
                            value={salaryMin}
                            onChange={(event) => setSalaryMin(event.target.value)}
                            required
                            disabled={isClosed}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salaryMax">Maximum budget</Label>
                          <Input
                            id="salaryMax"
                            type="number"
                            min={0}
                            placeholder="5000000"
                            value={salaryMax}
                            onChange={(event) => setSalaryMax(event.target.value)}
                            disabled={isClosed}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={salaryCurrency}
                            onValueChange={(value) =>
                              setSalaryCurrency(value as typeof salaryCurrency)
                            }
                            disabled={isClosed}
                          >
                            <SelectTrigger id="currency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VND">VND (₫)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentType">Payment cadence *</Label>
                          <Select
                            value={salaryPeriod}
                            onValueChange={(value) => setSalaryPeriod(value as typeof salaryPeriod)}
                            disabled={isClosed}
                          >
                            <SelectTrigger id="paymentType">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PAYMENT_TYPES.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          id="negotiable"
                          checked={salaryNegotiable}
                          onChange={(event) => setSalaryNegotiable(event.target.checked)}
                          className="h-4 w-4 rounded border border-border"
                          disabled={isClosed}
                        />
                        <span className="cursor-pointer">Budget is negotiable</span>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <Label>Genres *</Label>
                      {loadingGenres ? (
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-8 w-20 rounded-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {genres.map((genre) => (
                            <Badge
                              key={genre.name}
                              variant={selectedGenres.includes(genre.name) ? 'default' : 'outline'}
                              className="cursor-pointer px-3 py-1 text-sm"
                              onClick={() => !isClosed && toggleGenre(genre.name)}
                            >
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {selectedGenres.length === 0 && (
                        <p className="text-xs text-destructive">Select at least one genre.</p>
                      )}
                    </div>

                    <label className="flex items-start gap-2 rounded-md border border-dashed border-border/60 px-3 py-2">
                      <input
                        type="checkbox"
                        id="auto-notify"
                        checked={autoNotify}
                        onChange={(event) => setAutoNotify(event.target.checked)}
                        className="mt-1 h-4 w-4 rounded border border-border"
                        disabled={isClosed}
                      />
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium">Notify me about new submissions</span>
                        <p className="text-xs text-muted-foreground">
                          You&apos;ll receive notifications whenever a performer applies.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <Button type="button" variant="outline" className="w-full sm:flex-1" asChild>
                    <Link href={`/jobs/${jobId}`}>Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:flex-1"
                    disabled={!canSubmit || submitting || isClosed}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default JobEditPage
