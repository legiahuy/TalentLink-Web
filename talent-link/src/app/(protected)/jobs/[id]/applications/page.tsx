'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { jobService } from '@/services/jobService'
import { resolveMediaUrl } from '@/lib/utils'
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCcw,
  Eye,
  Check,
  X,
  SkipForward,
  Play,
  FileText,
  ExternalLink,
} from 'lucide-react'
import type { SubmissionResponse, SubmissionListResponse } from '@/types/job'

type StatusFilter =
  | 'all'
  | 'pending_review'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'skipped'
  | 'withdrawn'

const statusBadgeConfig: Record<
  string,
  {
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
    label: string
    icon: React.ReactNode
  }
> = {
  pending_review: {
    variant: 'secondary',
    label: 'Pending Review',
    icon: <Clock className="w-3 h-3" />,
  },
  under_review: {
    variant: 'default',
    label: 'Under Review',
    icon: <Play className="w-3 h-3" />,
  },
  accepted: {
    variant: 'default',
    label: 'Accepted',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  rejected: {
    variant: 'destructive',
    label: 'Rejected',
    icon: <XCircle className="w-3 h-3" />,
  },
  skipped: {
    variant: 'outline',
    label: 'Skipped',
    icon: <SkipForward className="w-3 h-3" />,
  },
  withdrawn: {
    variant: 'outline',
    label: 'Withdrawn',
    icon: <FileText className="w-3 h-3" />,
  },
}

const formatDate = (value?: string) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusBadge = (status: string) => {
  const config = statusBadgeConfig[status] || {
    variant: 'outline' as const,
    label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    icon: <FileText className="w-3 h-3" />,
  }
  return (
    <Badge variant={config.variant} className="gap-1.5">
      {config.icon}
      {config.label}
    </Badge>
  )
}

const JobApplicationsPage = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const jobId = params?.id ?? ''

  const [job, setJob] = useState<{ id: string; title: string } | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionResponse | null>(null)
  const [reviewAction, setReviewAction] = useState<'accept' | 'reject' | 'skip' | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchJob = useCallback(async () => {
    try {
      const jobData = await jobService.getJobById(jobId)
      setJob({ id: jobData.id, title: jobData.title })
    } catch (err) {
      console.error('Failed to load job', err)
    }
  }, [jobId])

  const fetchSubmissions = useCallback(async () => {
    setError(null)
    try {
      const response = await jobService.getJobSubmissions(jobId, {
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: 1,
        page_size: 50,
      })
      setSubmissions(response.submissions ?? [])
    } catch (err) {
      console.error('Failed to load submissions', err)
      setError('Unable to load applications right now.')
      toast.error('Unable to load applications.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [jobId, statusFilter])

  useEffect(() => {
    if (jobId) {
      fetchJob()
      fetchSubmissions()
    }
  }, [jobId, fetchJob, fetchSubmissions])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSubmissions()
  }

  const handleReview = (submission: SubmissionResponse, action: 'accept' | 'reject' | 'skip') => {
    setSelectedSubmission(submission)
    setReviewAction(action)
    setReviewNotes('')
    setReviewDialogOpen(true)
  }

  const confirmReview = async () => {
    if (!selectedSubmission || !reviewAction) return

    setProcessing(selectedSubmission.id)
    try {
      await jobService.reviewSubmission(
        selectedSubmission.id,
        reviewAction,
        reviewNotes || undefined,
      )
      toast.success(
        `Application ${reviewAction === 'accept' ? 'accepted' : reviewAction === 'reject' ? 'rejected' : 'skipped'} successfully`,
      )
      setReviewDialogOpen(false)
      setSelectedSubmission(null)
      setReviewAction(null)
      setReviewNotes('')
      await fetchSubmissions()
    } catch (err) {
      console.error('Failed to review submission', err)
      toast.error('Failed to update application status')
    } finally {
      setProcessing(null)
    }
  }

  const handleViewSubmission = (submissionId: string) => {
    // TODO: Open submission detail modal/page
    router.push(`/jobs/${jobId}?submission=${submissionId}`)
  }

  const handleViewProfile = (userId: string) => {
    // TODO: Navigate to user profile
    router.push(`/profile/${userId}`)
  }

  const statusCounts = useMemo(() => {
    const counts = {
      all: submissions.length,
      pending_review: 0,
      under_review: 0,
      accepted: 0,
      rejected: 0,
      skipped: 0,
      withdrawn: 0,
    }
    submissions.forEach((sub) => {
      if (sub.status in counts) {
        counts[sub.status as keyof typeof counts]++
      }
    })
    return counts
  }, [submissions])

  return (
    <div className="min-h-screen relative">
      <section className="relative border-b pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-linear-to-br from-primary/15 via-primary/8 to-primary/5">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent animate-shimmer" />

        <div className="relative mx-auto w-full max-w-[1320px] px-4 md:px-6 z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 text-foreground">
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                Job applications
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold">
                {job ? job.title : 'Applications'}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Review and manage applications for this job posting.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-linear-to-br from-muted/50 via-muted/30 to-muted/40 relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-8 md:py-12 relative z-10">
          <div className="flex justify-between w-full mb-6">
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {job && (
                <Button variant="outline" asChild>
                  <Link href={`/jobs/${job.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Job
                  </Link>
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="justify-start gap-2"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing' : 'Refresh'}
            </Button>
          </div>

          {/* Stats Summary */}
          {/* {!loading && submissions.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="text-2xl font-bold">{statusCounts.all}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending_review}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Reviewing</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.under_review}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.accepted}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Skipped</p>
                  <p className="text-2xl font-bold text-gray-600">{statusCounts.skipped}</p>
                </CardContent>
              </Card>
            </div>
          )} */}

          <Card className="border-border/60 bg-card/80 shadow-lg backdrop-blur-sm">
            <CardContent className="p-0">
              <Tabs
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              >
                <div className="flex flex-col gap-4 border-b border-border/60 p-4 md:flex-row md:items-center md:justify-between">
                  <TabsList className="grid w-full max-w-2xl grid-cols-5">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending_review">Pending</TabsTrigger>
                    {/* <TabsTrigger value="under_review">Reviewing</TabsTrigger> */}
                    <TabsTrigger value="accepted">Accepted</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    {/* <TabsTrigger value="skipped">Skipped</TabsTrigger> */}
                    <TabsTrigger value="withdrawn">Withdrawn</TabsTrigger>
                  </TabsList>
                  <p className="text-sm text-muted-foreground">
                    {submissions.length} {submissions.length === 1 ? 'application' : 'applications'}
                  </p>
                </div>

                <TabsContent value={statusFilter} className="m-0">
                  {loading ? (
                    <div className="space-y-4 p-4 md:p-6">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-40 w-full rounded-xl" />
                      ))}
                    </div>
                  ) : error ? (
                    <div className="p-10 text-center">
                      <p className="text-base text-muted-foreground mb-4">{error}</p>
                      <Button onClick={handleRefresh} disabled={refreshing}>
                        Try again
                      </Button>
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className="p-10 text-center space-y-4">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-semibold">No applications yet</h3>
                        <p className="text-muted-foreground">
                          {statusFilter === 'all'
                            ? "This job hasn't received any applications yet."
                            : `No ${statusFilter.replace('_', ' ')} applications found.`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {submissions.map((submission) => (
                        <div key={submission.id} className="p-4 md:p-6 space-y-4">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4 flex-1">
                              <Avatar className="w-12 h-12 rounded-lg">
                                <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                                  {(submission.full_name || 'A')
                                    .split(' ')
                                    .map((word) => word[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold">
                                    {submission.full_name || 'Anonymous Applicant'}
                                  </h3>
                                  {getStatusBadge(submission.status)}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  {submission.email && <span>{submission.email}</span>}
                                  {submission.phone_number && (
                                    <span>{submission.phone_number}</span>
                                  )}
                                  <span>Applied {formatDate(submission.created_at)}</span>
                                  {submission.reviewed_at && (
                                    <span>• Reviewed {formatDate(submission.reviewed_at)}</span>
                                  )}
                                </div>
                                {submission.cover_letter && (
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {submission.cover_letter}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {submission.can_be_reviewed && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReview(submission, 'accept')}
                                    disabled={processing === submission.id}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReview(submission, 'reject')}
                                    disabled={processing === submission.id}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                  {/* <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleReview(submission, 'skip')}
                                    disabled={processing === submission.id}
                                  >
                                    <SkipForward className="w-4 h-4 mr-1" />
                                    Skip
                                  </Button> */}
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewSubmission(submission.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <AlertDialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {reviewAction === 'accept'
                ? 'Accept Application'
                : reviewAction === 'reject'
                  ? 'Reject Application'
                  : 'Skip Application'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reviewAction === 'accept'
                ? 'This will accept the application and move it to the accepted tab. You can then start a conversation with the applicant.'
                : reviewAction === 'reject'
                  ? 'This will reject the application. You can optionally provide a reason.'
                  : 'This will skip the application for now. You can review it later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {(reviewAction === 'reject' || reviewAction === 'accept') && (
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder={
                    reviewAction === 'reject'
                      ? 'Provide a reason for rejection...'
                      : 'Add any notes about this application...'
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReview}
              disabled={processing === selectedSubmission?.id}
              className={
                reviewAction === 'reject'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : ''
              }
            >
              {processing === selectedSubmission?.id
                ? 'Processing...'
                : reviewAction === 'accept'
                  ? 'Accept'
                  : reviewAction === 'reject'
                    ? 'Reject'
                    : 'Skip'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default JobApplicationsPage
