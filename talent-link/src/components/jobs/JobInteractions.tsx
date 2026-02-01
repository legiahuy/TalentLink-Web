'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
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
import { Separator } from '@/components/ui/separator'
import ApplicationDialog from '@/components/jobs/ApplicationDialog'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { useTranslations } from 'next-intl'
import { jobService } from '@/services/jobService'
import type { JobPost, MySubmissionsResponse, MySubmissionItem } from '@/types/job'
import JobMessageDialog from './JobMessageDialog'

interface JobWithCreator extends JobPost {
  creator_display_name?: string
  creator_avatar_url?: string
  creator_username?: string
}

interface JobInteractionsProps {
  job: JobWithCreator
}

export default function JobInteractions({ job }: JobInteractionsProps) {
  const t = useTranslations('JobDetail')
  const tCommon = useTranslations('Common')
  const router = useRouter()

  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)

  const { isJobSaved, toggleSave } = useSavedJobs()
  const isSaved = isJobSaved(job.id)

  useEffect(() => {
    // Check if user has already applied on mount
    const checkApplication = async () => {
      try {
        const mySubmissions = await jobService.getMySubmissions()
        const myApplication = mySubmissions.submissions?.find((sub) => sub.job?.id === job.id)
        if (myApplication) {
          setHasApplied(true)
          setApplicationStatus(myApplication.status)
        }
      } catch (err) {
        // Silently fail - user might not be logged in
        console.error('Failed to check application status', err)
      }
    }
    checkApplication()
  }, [job.id])

  return (
    <>
      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24 shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            {hasApplied ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t('applicationStatus')}</p>
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
                      return t(`status.${status}`)
                    })()}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full hidden sm:flex" size="lg" asChild>
                  <Link href="/jobs/my-applications">{t('viewApplications')}</Link>
                </Button>
              </div>
            ) : (
              <Button
                className="w-full bg-primary hover:bg-primary/90 hidden sm:flex"
                size="lg"
                onClick={() => setIsApplicationOpen(true)}
                disabled={job?.status !== 'published' || job?.is_deadline_passed}
              >
                {job?.is_deadline_passed ? t('closed') : t('applyNow')}
              </Button>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => toggleSave(job.id)}>
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 mr-2 text-primary fill-primary" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-2" />
                )}
                {isSaved ? t('saved') : t('save')}
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
                {t('share')}
              </Button>
            </div>

            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsMessageDialogOpen(true)}
            >
              <MessageCircle className="w-4 h-4" />
              {t('message')}
            </Button>

            {job.status && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">{t('statusBadge')}</h3>
                  <Badge variant={job.status === 'published' ? 'default' : 'secondary'}>
                    {t(`status.${job.status}`)}
                  </Badge>
                </div>
              </>
            )}

            {(job.total_submissions !== undefined ||
              job.applications_count !== undefined) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">{t('totalApplications')}</h3>
                    <p className="text-2xl font-bold">
                      {job.total_submissions || job.applications_count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('totalApplications')}</p>
                  </div>
                </>
              )}

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p>
                {t('postedOn', {
                  date: new Date(job.created_at).toLocaleDateString(tCommon('locale'), {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                })}
              </p>
              {/* Note: getTimeAgo logic is mostly UI helper, could duplicate or move to utils if needed. 
                  For now, omitted or needs simple date string to avoid dragging in complex utils 
                  unless we import the same helper logic. */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Fixed Bottom Actions */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50 shadow-lg">
        <div className="flex gap-2">
          {hasApplied ? (
            <Button variant="outline" className="flex-1 h-12" asChild>
              <Link href="/jobs/my-applications">
                <FileText className="w-4 h-4 mr-2" />
                {t('viewApplication')}
              </Link>
            </Button>
          ) : (
            <Button
              className="flex-1 h-12 bg-primary hover:bg-primary/90"
              onClick={() => setIsApplicationOpen(true)}
              disabled={job?.status !== 'published' || job?.is_deadline_passed}
            >
              <Send className="w-4 h-4 mr-2" />
              {job?.is_deadline_passed ? t('closed') : t('apply')}
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: job.title,
                  text: job.brief_description || job.description,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('share')}
          </Button>
          <Button
            variant="secondary"
            className="flex-1 h-12"
            onClick={() => setIsMessageDialogOpen(true)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('message')}
          </Button>
        </div>
      </div>

      <ApplicationDialog
        open={isApplicationOpen}
        onOpenChange={(open) => {
          setIsApplicationOpen(open)
          if (!open) {
            // Refresh application status
            const checkApplication = async () => {
              try {
                const mySubmissions: MySubmissionsResponse = await jobService.getMySubmissions()
                const myApplication = mySubmissions.submissions.find(
                  (sub: MySubmissionItem) => sub.job?.id === job.id,
                )
                if (myApplication) {
                  setHasApplied(true)
                  setApplicationStatus(myApplication.status)
                }
              } catch (err) {
                console.error('Failed to check application status', err)
              }
            }
            checkApplication()
          }
        }}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.creator_display_name || tCommon('unknown')}
      />
      
      <JobMessageDialog
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        job={job}
      />
    </>
  )
}
