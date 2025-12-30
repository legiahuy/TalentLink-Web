'use client'

import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { AdminJobCard } from './AdminJobCard'
import type { FeaturedJob } from '@/types/admin'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface SearchJobsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJobFeatured: () => void
}

export function SearchJobsDialog({ open, onOpenChange, onJobFeatured }: SearchJobsDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FeaturedJob[]>([])
  const [searching, setSearching] = useState(false)
  const [featuringId, setFeaturingId] = useState<string | null>(null)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setSearching(true)
    try {
      const jobs = await adminService.searchJobs(query)
      setResults(jobs)
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Failed to search jobs')
    } finally {
      setSearching(false)
    }
  }, [query])

  const handleFeature = async (jobId: string, isFeatured: boolean) => {
    if (isFeatured) {
      toast.info('This job is already featured')
      return
    }

    setFeaturingId(jobId)
    try {
      await adminService.featureJob(jobId)
      toast.success('Job featured successfully')
      onJobFeatured()
      // Remove from results or update status
      setResults(results.map(j => j.id === jobId ? { ...j, is_featured: true } : j))
    } catch (error) {
      console.error('Failed to feature job:', error)
      toast.error('Failed to feature job')
    } finally {
      setFeaturingId(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border-border/50 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Search Jobs to Feature</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={searching || !query.trim()}>
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {searching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {query.trim() ? 'No jobs found' : 'Enter a search query to find jobs'}
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {results.map((job) => (
                <motion.div key={job.id} variants={fadeInUp}>
                  <AdminJobCard
                    job={job}
                    onFeatureToggle={handleFeature}
                    isLoading={featuringId === job.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
