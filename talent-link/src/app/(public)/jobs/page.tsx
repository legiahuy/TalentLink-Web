'use client'
import { useState, useMemo } from 'react'
import JobCard from '@/components/jobs/JobCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Search, Plus, Briefcase, X, Sparkles, Music, Building2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Job, JobType } from '@/types/job'

// Mock data - moved outside component to avoid Date.now() in render
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Acoustic Singer for Weekend Night',
    company: 'Acoustic Cafe & Bar',
    companyLogo:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=100&h=100&fit=crop',
    type: 'Singer',
    location: 'District 1, Ho Chi Minh City',
    salary: '$150-250/show',
    postedDate: '2025-01-13T10:00:00Z',
    genres: ['Acoustic', 'Pop'],
    description:
      'Looking for a warm-voiced singer suitable for acoustic spaces. Performance duration: 2 hours per show.',
    requirements: [
      'Minimum 1 year of performance experience',
      'Having your own music set is a plus',
    ],
  },
  {
    id: '2',
    title: 'Rock Band for Event Series',
    company: 'Rock Arena',
    companyLogo:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
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
  },
  {
    id: '3',
    title: 'Jazz Guitarist for Night Performance',
    company: 'Blue Note Jazz Club',
    companyLogo:
      'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=100&h=100&fit=crop',
    type: 'Musician',
    location: 'District 2, Ho Chi Minh City',
    salary: '$100-200/show',
    postedDate: '2025-01-09T10:00:00Z',
    genres: ['Jazz', 'Blues'],
    description:
      'Need a jazz-savvy guitarist to join the venue house band. Must be able to read music and improvise well.',
    requirements: ['Proficient in jazz guitar', 'Ability to read music and improvise'],
  },
  {
    id: '4',
    title: 'DJ for Grand Opening Event',
    company: 'The Lounge Bar',
    companyLogo:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop',
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
  },
]

const JobPool = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [activeTab, setActiveTab] = useState<JobType>('all')
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  const availableGenres = useMemo(() => {
    const genres = new Set<string>()
    MOCK_JOBS.forEach((job) => job.genres.forEach((genre) => genres.add(genre)))
    return Array.from(genres).sort()
  }, [])

  const availableLocations = useMemo(() => {
    const locations = new Set<string>()
    MOCK_JOBS.forEach((job) => {
      const location = job.location.split(',')[0].trim()
      locations.add(location)
    })
    return Array.from(locations).sort()
  }, [])

  const filteredJobs = useMemo(() => {
    let filtered = MOCK_JOBS.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesGenre = selectedGenre === 'all' || job.genres.includes(selectedGenre)
      const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation)
      return matchesSearch && matchesGenre && matchesLocation
    })

    // Filter by tab
    if (activeTab === 'artist') {
      filtered = filtered.filter((j) => j.type !== 'Venue')
    } else if (activeTab === 'saved') {
      filtered = filtered.filter((j) => savedJobs.has(j.id))
    }

    return filtered
  }, [searchQuery, selectedGenre, selectedLocation, activeTab, savedJobs])

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

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-10 md:pt-24 md:pb-12">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Find Your Next Gig
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Venues looking for talent. Artists looking for stages. Your next performance is here.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="lg:w-64 lg:shrink-0">
            <Card className="p-4 lg:sticky lg:top-6">
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
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                  <TabsTrigger value="all" className="gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="artist" className="gap-1.5 text-xs">
                    <Music className="w-3.5 h-3.5" />
                    Artists
                  </TabsTrigger>
                  <TabsTrigger value="venue" className="gap-1.5 text-xs">
                    <Building2 className="w-3.5 h-3.5" />
                    Venues
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="gap-1.5 text-xs">
                    <Briefcase className="w-3.5 h-3.5" />
                    Saved
                  </TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                {filteredJobs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobs.has(job.id)}
                        onToggleSave={handleToggleSave}
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

              <TabsContent value="artist" className="mt-0">
                {filteredJobs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSaved={savedJobs.has(job.id)}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No artist jobs found</h3>
                    <p className="text-muted-foreground">
                      No artist positions match your current filters.
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="venue" className="mt-0">
                <Card className="p-12 text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Venue search functionality is currently under development.
                  </p>
                </Card>
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
    </main>
  )
}

export default JobPool
