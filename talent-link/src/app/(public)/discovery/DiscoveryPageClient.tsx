'use client'
import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Search, Music, MapPin, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ArtistCard from '@/components/artist/ArtistCard'
import { userService } from '@/services/userService'
import { searchService } from '@/services/searchService'
import { resolveMediaUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { UserSearchRequestDto } from '@/types/search'

interface DiscoveryItem {
  id: string
  name: string
  username: string
  image: string
  genres: string[]
  location: string
  description: string
  role: string
}

type FilterType = 'all' | 'artists' | 'venues'

interface DiscoveryPageClientProps {
  initialArtists: DiscoveryItem[]
  initialVenues: DiscoveryItem[]
}

const DiscoveryPageClient = ({ initialArtists = [], initialVenues = [] }: DiscoveryPageClientProps) => {
  const t = useTranslations('Discovery')
  const tCommon = useTranslations('Common')
  const tOptions = useTranslations('options')

  // State
  const [artists, setArtists] = useState<DiscoveryItem[]>(initialArtists)
  const [venues, setVenues] = useState<DiscoveryItem[]>(initialVenues)
  const [loading, setLoading] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [activeTab, setActiveTab] = useState<FilterType>('all')

  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  const [availableLocations, setAvailableLocations] = useState<string[]>([])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Animations - optimized for faster display
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  // Fetch genres once on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const systemGenres = await userService.getGenres()
        if (systemGenres && systemGenres.length > 0) {
          setAvailableGenres(systemGenres.map((g) => g.name).sort())
        }
      } catch (error) {
        console.error('Failed to fetch genres', error)
      }
    }
    fetchGenres()
  }, [])

  // Fetch data when filters change
  useEffect(() => {
    // Skip initial fetch if we use initial props and filters are default
    // Assuming initialProps match default filters
    if (debouncedSearch === '' && selectedGenre === 'all' && selectedLocation === 'all' && initialArtists.length > 0) {
        return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Prepare search request
        const request: UserSearchRequestDto = {
          page: 1,
          pageSize: 100, // Reasonable limit for discovery
        }

        if (debouncedSearch) request.query = debouncedSearch
        if (selectedGenre !== 'all') request.genres = [selectedGenre]
        if (selectedLocation !== 'all') request.location = selectedLocation

        const result = await searchService.searchUsers(request)
        const allUsers = result.userProfiles

        // Transform Artists
        const transformedArtists = allUsers
          .filter((user) => user.role !== 'venue')
          .map((user) => ({
            id: user.id,
            name: user.displayName || tCommon('unknown'),
            username: user.username,
            image: user.avatarUrl ? resolveMediaUrl(user.avatarUrl) : '/images/artist/default-avatar.jpeg',
            genres: (user.genres || [])
              .map((g: { name?: string } | string) => (typeof g === 'string' ? g : g.name || ''))
              .filter(Boolean),
            location: user.location || tCommon('unknown'),
            description: user.briefBio || '',
            role: user.role,
          }))

        // Transform Venues
        const transformedVenues = allUsers
          .filter((user) => user.role === 'venue')
          .map((user) => ({
            id: user.id,
            name: user.displayName || tCommon('unknown'),
            username: user.username,
            image: user.avatarUrl ? resolveMediaUrl(user.avatarUrl) : '/images/artist/default-avatar.jpeg',
            genres: (user.genres || [])
              .map((g: { name?: string } | string) => (typeof g === 'string' ? g : g.name || ''))
              .filter(Boolean),
            location: user.location || tCommon('unknown'),
            description: user.briefBio || '',
            role: user.role,
          }))

        setArtists(transformedArtists)
        setVenues(transformedVenues)
      } catch (error) {
        console.error('Failed to fetch discovery data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [debouncedSearch, selectedGenre, selectedLocation, initialArtists.length])

  // Fetch locations once on mount (fetch all users to get unique locations)
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch all users without filters to get all available locations
        const result = await searchService.searchUsers({
          page: 1,
          pageSize: 1000, // Large enough to get all users
        })
        const allUsers = result.userProfiles
        
        const locations = new Set<string>()
        allUsers.forEach((user) => {
          if (user.location && user.location !== tCommon('unknown')) {
            locations.add(user.location)
          }
        })
        setAvailableLocations(Array.from(locations).sort())
      } catch (error) {
        console.error('Failed to fetch locations', error)
      }
    }
    fetchLocations()
  }, [tCommon])

  // Counts for UI
  const filteredArtists = artists
  const filteredVenues = venues
  const allFilteredCount = filteredArtists.length + filteredVenues.length
  
  // Dynamic count based on active tab
  const displayCount = 
    activeTab === 'all' 
      ? allFilteredCount 
      : activeTab === 'artists' 
        ? filteredArtists.length 
        : filteredVenues.length

  const hasActiveFilters =
    searchQuery !== '' || selectedGenre !== 'all' || selectedLocation !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('all')
    setSelectedLocation('all')
  }

  return (
    <div className="min-h-screen relative pb-20">
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

        {/* Animated floating orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-20 w-52 h-52 bg-primary/25 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-10 left-1/3 w-44 h-44 bg-primary/20 rounded-full blur-3xl animate-float-slow" />

        {/* Glowing accent lines */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1320px] px-4 md:px-6 z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight relative">
              <span className="relative z-10">{t('hero.title')}</span>
              <span className="absolute inset-0 bg-linear-to-r from-primary/40 via-primary/30 to-primary/20 blur-2xl animate-pulse opacity-60" />
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed relative z-10">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="w-full bg-linear-to-br from-muted/50 via-muted/30 to-muted/40 relative">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-8 md:py-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6 relative">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 lg:shrink-0">
              <Card className="p-4 lg:sticky lg:top-24 shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-sm uppercase tracking-wide">
                      {t('filters.title')}
                    </h2>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        {t('filters.clear')}
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        {t('filters.search')}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder={t('filters.search')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        {t('filters.genre')}
                      </label>
                      <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder={t('filters.genreAll')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('filters.genreAll')}</SelectItem>
                          {availableGenres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block capitalize">
                        {t('filters.location')}
                      </label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder={t('filters.locationAll')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('filters.locationAll')}</SelectItem>
                          {availableLocations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FilterType)}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                  <TabsList className="h-11 p-1 bg-muted/50 backdrop-blur-sm border border-border/40">
                    <TabsTrigger value="all" className="px-5 text-sm gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('tabs.all')}
                    </TabsTrigger>
                    <TabsTrigger value="artists" className="px-5 text-sm gap-2">
                      <Music className="w-3.5 h-3.5" />
                      {t('tabs.artists')}
                    </TabsTrigger>
                    <TabsTrigger value="venues" className="px-5 text-sm gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {t('tabs.venues')}
                    </TabsTrigger>
                  </TabsList>

                  <div className="px-4 py-1.5 bg-muted/60 backdrop-blur-sm border border-border/40 rounded-full text-xs font-semibold text-muted-foreground shadow-sm">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                        {tCommon('loading')}
                      </span>
                    ) : (
                      `${displayCount} ${tCommon('results') || 'results'}`
                    )}
                  </div>
                </div>

                {/* Content Rendering Helper */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-96 rounded-xl border border-border bg-card animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <TabsContent value="all" className="mt-0 space-y-10">
                      {filteredArtists.length === 0 && filteredVenues.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-border rounded-xl">
                          <p className="text-muted-foreground">{t('noResults')}</p>
                        </div>
                      ) : (
                        <>
                          {filteredArtists.length > 0 && (
                            <section>
                              <div className="flex items-center gap-3 mb-6">
                                <div className="bg-primary/10 p-2.5 rounded-full ring-4 ring-primary/5">
                                  <Music className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">{t('sections.artists')}</h2>
                                <div className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center border border-border/40">
                                  {filteredArtists.length}
                                </div>
                              </div>
                              <motion.div
                                key={`artists-${searchQuery}-${selectedGenre}-${selectedLocation}`}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial="hidden"
                                animate="show"
                                variants={staggerContainer}
                              >
                                {filteredArtists.map((item) => (
                                  <motion.div key={item.id} variants={fadeInUp} className="h-full">
                                    <ArtistCard
                                      {...item}
                                      roleLabel={tOptions(`roles.${item.role}`)}
                                    />
                                  </motion.div>
                                ))}
                              </motion.div>
                            </section>
                          )}

                          {filteredVenues.length > 0 && (
                            <section>
                              <div className="flex items-center gap-3 mb-6">
                                <div className="bg-primary/10 p-2.5 rounded-full ring-4 ring-primary/5">
                                  <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">{t('sections.venues')}</h2>
                                <div className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center border border-border/40">
                                  {filteredVenues.length}
                                </div>
                              </div>
                              <motion.div
                                key={`venues-${searchQuery}-${selectedGenre}-${selectedLocation}`}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial="hidden"
                                animate="show"
                                variants={staggerContainer}
                              >
                                {filteredVenues.map((item) => (
                                  <motion.div key={item.id} variants={fadeInUp} className="h-full">
                                    <ArtistCard
                                      {...item}
                                      roleLabel={tOptions(`roles.${item.role}`)}
                                    />
                                  </motion.div>
                                ))}
                              </motion.div>
                            </section>
                          )}
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="artists" className="mt-0">
                      {filteredArtists.length > 0 ? (
                        <motion.div
                          key={`artists-tab-${searchQuery}-${selectedGenre}-${selectedLocation}`}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          initial="hidden"
                          animate="show"
                          variants={staggerContainer}
                        >
                          {filteredArtists.map((item) => (
                            <motion.div key={item.id} variants={fadeInUp} className="h-full">
                              <ArtistCard
                                {...item}
                                roleLabel={tOptions(`roles.${item.role}`)}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="text-center py-12 border border-dashed border-border rounded-xl">
                          <p className="text-muted-foreground">{t('noResults')}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="venues" className="mt-0">
                      {filteredVenues.length > 0 ? (
                        <motion.div
                          key={`venues-tab-${searchQuery}-${selectedGenre}-${selectedLocation}`}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          initial="hidden"
                          animate="show"
                          variants={staggerContainer}
                        >
                          {filteredVenues.map((item) => (
                            <motion.div key={item.id} variants={fadeInUp} className="h-full">
                              <ArtistCard
                                {...item}
                                roleLabel={tOptions(`roles.${item.role}`)}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="text-center py-12 border border-dashed border-border rounded-xl">
                          <p className="text-muted-foreground">{t('noResults')}</p>
                        </div>
                      )}
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoveryPageClient
