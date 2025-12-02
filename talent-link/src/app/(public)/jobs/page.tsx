'use client'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import JobCard from '@/components/jobs/JobCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Search, Plus, Briefcase, X, Sparkles, Loader2, Mic, Disc } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { jobService } from '@/services/jobService'
import type { JobPost, JobPostFilters } from '@/types/job'

type JobType = 'all' | 'producer' | 'musician' | 'saved'

// Backend now returns creator_name, creator_username, creator_avatar directly
type JobWithCreator = JobPost

const SAVED_JOBS_KEY = 'talentlink_saved_jobs'

const JobPool = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [activeTab, setActiveTab] = useState<JobType>('all')
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [jobs, setJobs] = useState<JobWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_JOBS_KEY)
    if (saved) {
      try {
        setSavedJobs(new Set(JSON.parse(saved)))
      } catch (e) {
        console.error('Failed to load saved jobs', e)
      }
    }
  }, [])

  // Save jobs to localStorage when changed
  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(Array.from(savedJobs)))
  }, [savedJobs])

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500) // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      let response

      if (debouncedSearch.trim()) {
        // Use search endpoint
        response = await jobService.searchJobs(debouncedSearch, 1, 20)
      } else {
        // Use list endpoint with filters
        const filters: JobPostFilters = {
          status: 'published', // Only show published jobs
          page: 1,
          page_size: 20,
        }

        // Note: Filter by type will be done on frontend since backend doesn't support it

        // Add genre filter
        if (selectedGenre !== 'all') {
          filters.genres = [selectedGenre]
        }

        // Add location filter
        if (selectedLocation !== 'all') {
          filters.location = selectedLocation
        }

        response = await jobService.listJobs(filters)
      }

      // Backend already returns creator_name, creator_username, creator_avatar
      setJobs(response.posts)
    } catch (error) {
      console.error('Failed to fetch jobs', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedGenre, selectedLocation])

  // Fetch jobs when filters or search change
  useEffect(() => {
    if (activeTab !== 'saved') {
      fetchJobs()
    } else {
      setLoading(false)
    }
  }, [activeTab, fetchJobs])

  const availableGenres = useMemo(() => {
    const genres = new Set<string>()
    jobs.forEach((job) => job.genres?.forEach((genre) => genres.add(genre)))
    return Array.from(genres).sort()
  }, [jobs])

  const availableLocations = useMemo(() => {
    const locations = new Set<string>()
    jobs.forEach((job) => {
      if (job.location) {
        const location = job.location.split(',')[0].trim()
        locations.add(location)
      }
    })
    return Array.from(locations).sort()
  }, [jobs])

  const filteredJobs = useMemo(() => {
    let filtered = jobs

    // Filter by tab (type field - looking for roles)
    if (activeTab === 'saved') {
      filtered = jobs.filter((j) => savedJobs.has(j.id))
    } else if (activeTab !== 'all') {
      filtered = jobs.filter((j) => j.type === activeTab)
    }

    return filtered
  }, [jobs, activeTab, savedJobs])

  const hasActiveFilters =
    searchQuery !== '' || selectedGenre !== 'all' || selectedLocation !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('all')
    setSelectedLocation('all')
  }

  const handleToggleSave = (jobId: string, isSaved: boolean) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (isSaved) {
        newSet.add(jobId)
      } else {
        newSet.delete(jobId)
      }
      return newSet
    })
  }

  const handleViewDetails = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative border-b pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-linear-to-br from-primary/15 via-primary/8 to-primary/5">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-transparent animate-pulse" />

        {/* Animated grid pattern */}
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

        {/* Animated floating orbs - more visible */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-20 w-52 h-52 bg-primary/25 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-10 left-1/3 w-44 h-44 bg-primary/20 rounded-full blur-3xl animate-float-slow" />

        {/* Glowing accent lines - more visible */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1320px] px-4 md:px-6 z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight relative">
                <span className="relative z-10">Find Your Next Gig</span>
                <span className="absolute inset-0 bg-linear-to-r from-primary/40 via-primary/30 to-primary/20 blur-2xl animate-pulse opacity-60" />
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed relative z-10">
                Venues looking for talent. Artists looking for stages. Your next performance is
                here.
              </p>
            </div>
            <div className="shrink-0 relative z-10">
              <Button size="lg" className="w-full md:w-auto" asChild>
                <Link href="/jobs/post">
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Job
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width background wrapper */}
      <div className="w-full bg-linear-to-br from-muted/50 via-muted/30 to-muted/40 relative">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        {/* Decorative blur orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-8 md:py-10 relative z-10">
          {/* Muted gradient background - blends with hero */}
          <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6 relative">
            {/* Sidebar Filters - Desktop */}
            <aside className="lg:w-64 lg:shrink-0">
              <Card className="p-4 lg:sticky lg:top-24 shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-sm uppercase tracking-wide">Filters</h2>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Jobs, venues..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Genre
                      </label>
                      <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="All genres" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All genres</SelectItem>
                          {availableGenres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Location
                      </label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="All locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All locations</SelectItem>
                          {availableLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {hasActiveFilters && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                          Active Filters
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {searchQuery && (
                            <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                              {searchQuery}
                              <button
                                onClick={() => setSearchQuery('')}
                                className="ml-0.5 hover:bg-muted rounded-full p-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </Badge>
                          )}
                          {selectedGenre !== 'all' && (
                            <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                              {selectedGenre}
                              <button
                                onClick={() => setSelectedGenre('all')}
                                className="ml-0.5 hover:bg-muted rounded-full p-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </Badge>
                          )}
                          {selectedLocation !== 'all' && (
                            <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                              {selectedLocation}
                              <button
                                onClick={() => setSelectedLocation('all')}
                                className="ml-0.5 hover:bg-muted rounded-full p-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as JobType)}>
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="grid w-full max-w-xl grid-cols-4 bg-muted/50">
                    <TabsTrigger value="all" className="gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="producer" className="gap-1.5 text-xs">
                      <Disc className="w-3.5 h-3.5" />
                      For Producers
                    </TabsTrigger>
                    <TabsTrigger value="musician" className="gap-1.5 text-xs">
                      <Mic className="w-3.5 h-3.5" />
                      For Singers
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="gap-1.5 text-xs">
                      <Briefcase className="w-3.5 h-3.5" />
                      Saved
                    </TabsTrigger>
                  </TabsList>
                  <div className="text-sm text-muted-foreground hidden sm:block font-medium">
                    {loading
                      ? '...'
                      : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'job' : 'jobs'}`}
                  </div>
                </div>

                <TabsContent value="all" className="mt-0">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredJobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isSaved={savedJobs.has(job.id)}
                          onToggleSave={handleToggleSave}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filters to find more opportunities.
                      </p>
                      {hasActiveFilters && (
                        <Button variant="outline" onClick={clearFilters}>
                          Clear all filters
                        </Button>
                      )}
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="producer" className="mt-0">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredJobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isSaved={savedJobs.has(job.id)}
                          onToggleSave={handleToggleSave}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Disc className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No jobs for producers found</h3>
                      <p className="text-muted-foreground">
                        No jobs looking for producers match your current filters.
                      </p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="musician" className="mt-0">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredJobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isSaved={savedJobs.has(job.id)}
                          onToggleSave={handleToggleSave}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No jobs for singers found</h3>
                      <p className="text-muted-foreground">
                        No jobs looking for singers match your current filters.
                      </p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="saved" className="mt-0">
                  {filteredJobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isSaved={true}
                          onToggleSave={handleToggleSave}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
                      <p className="text-muted-foreground">
                        Save jobs you&apos;re interested in to view them here later.
                      </p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobPool
