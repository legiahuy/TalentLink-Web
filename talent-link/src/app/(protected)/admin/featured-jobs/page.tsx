'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdminJobCard } from '@/components/admin/AdminJobCard'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { SearchJobsDialog } from '@/components/admin/SearchJobsDialog'
import { ChevronLeft, ChevronRight, Briefcase, Plus } from 'lucide-react'
import { adminService } from '@/services/adminService'
import type { FeaturedJob } from '@/types/admin'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function FeaturedJobsPage() {
  const [jobs, setJobs] = useState<FeaturedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
  })
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    jobId: string
    isFeatured: boolean
    jobTitle: string
  }>({
    open: false,
    jobId: '',
    isFeatured: false,
    jobTitle: '',
  })

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminService.listFeaturedJobs({
        limit: pagination.limit,
        offset: pagination.offset,
      })
      setJobs(response.data.posts)
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
      }))
    } catch (error) {
      console.error('Failed to fetch featured jobs:', error)
      toast.error('Failed to load featured jobs')
    } finally {
      setLoading(false)
    }
  }, [pagination.limit, pagination.offset])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleFeatureToggle = (jobId: string, isFeatured: boolean) => {
    const job = jobs.find((j) => j.id === jobId)
    setConfirmDialog({
      open: true,
      jobId,
      isFeatured,
      jobTitle: job?.title || 'this job',
    })
  }

  const handleConfirmToggle = async () => {
    const { jobId, isFeatured } = confirmDialog
    setActionLoading(jobId)
    setConfirmDialog({ ...confirmDialog, open: false })

    try {
      if (isFeatured) {
        await adminService.unfeatureJob(jobId)
        toast.success('Job unfeatured successfully')
      } else {
        await adminService.featureJob(jobId)
        toast.success('Job featured successfully')
      }
      await fetchJobs()
    } catch (error) {
      console.error('Failed to toggle feature status:', error)
      toast.error('Failed to update feature status')
    } finally {
      setActionLoading(null)
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1

  const goToPage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      offset: (page - 1) * prev.limit,
    }))
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Featured Jobs
          </h1>
          <Button onClick={() => setSearchDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Featured Job
          </Button>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage which job posts appear on the landing page
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mb-6 flex items-center justify-between p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-sm font-medium">
          {loading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : (
            <span>
              <span className="text-primary font-bold text-lg">{pagination.total}</span>{' '}
              <span className="text-muted-foreground">featured jobs</span>
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
          <span className="font-medium text-foreground">{totalPages || 1}</span>
        </div>
      </motion.div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm animate-pulse"
            />
          ))}
        </div>
      ) : !jobs ? (
        <motion.div
          className="text-center py-16 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground text-lg">No featured jobs found</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {jobs.map((job) => (
            <motion.div key={job.id} variants={fadeInUp}>
              <AdminJobCard
                job={job}
                onFeatureToggle={handleFeatureToggle}
                isLoading={actionLoading === job.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div
          className="mt-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="hover:bg-primary/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className="w-10 hover:bg-primary/10 transition-colors"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="hover:bg-primary/10 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.isFeatured ? 'Unfeature Job' : 'Feature Job'}
        description={
          confirmDialog.isFeatured
            ? `Are you sure you want to remove "${confirmDialog.jobTitle}" from featured jobs? It will no longer appear on the landing page.`
            : `Are you sure you want to feature "${confirmDialog.jobTitle}"? It will appear on the landing page.`
        }
        confirmText={confirmDialog.isFeatured ? 'Unfeature' : 'Feature'}
        onConfirm={handleConfirmToggle}
        variant={confirmDialog.isFeatured ? 'destructive' : 'default'}
      />

      {/* Search Dialog */}
      <SearchJobsDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onJobFeatured={() => {
          fetchJobs()
          setSearchDialogOpen(false)
        }}
      />
    </div>
  )
}
