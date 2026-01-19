'use client'
import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Search, Music, MapPin, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ArtistCard from '@/components/artist/ArtistCard'
import { landingService } from '@/services/landingService'
import { userService } from '@/services/userService'
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

import type { FeaturedUser } from '@/types/admin'

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

const DiscoveryPage = () => {
  const t = useTranslations('Discovery')
  const tCommon = useTranslations('Common')

  // State
  const [artists, setArtists] = useState<DiscoveryItem[]>([])
  const [venues, setVenues] = useState<DiscoveryItem[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [activeTab, setActiveTab] = useState<FilterType>('all')

  const [availableGenres, setAvailableGenres] = useState<string[]>([])

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await landingService.getDiscoveryData()

        // Transform Artists
        const transformedArtists = data.artists.map((user: FeaturedUser) => ({
          id: user.id,
          name: user.display_name || tCommon('unknown'),
          username: user.username,
          image: user.avatar_url || '/images/auth/auth-photo-1.jpg',
          genres: user.genres?.map((g) => g.name) || [],
          location: [user.city, user.country].filter(Boolean).join(', ') || tCommon('unknown'),
          description: user.brief_bio || '',
          role: 'artist',
        }))

        // Transform Venues
        const transformedVenues = data.venues.map((user: FeaturedUser) => ({
          id: user.id,
          name: user.display_name || tCommon('unknown'),
          username: user.username,
          image: user.avatar_url || '/images/auth/auth-photo-1.jpg',
          genres: user.genres?.map((g) => g.name) || [],
          location: [user.city, user.country].filter(Boolean).join(', ') || tCommon('unknown'),
          description: user.brief_bio || '',
          role: 'venue',
        }))

        setArtists(transformedArtists)
        setVenues(transformedVenues)

        // Collect all unique genres from artists and venues
        const genresSet = new Set<string>()

        // Add genres from artists
        transformedArtists.forEach((artist) => {
          artist.genres.forEach((genre) => {
            if (genre) genresSet.add(genre)
          })
        })

        // Add genres from venues
        transformedVenues.forEach((venue) => {
          venue.genres.forEach((genre) => {
            if (genre) genresSet.add(genre)
          })
        })

        // Convert to sorted array
        const uniqueGenres = Array.from(genresSet).sort()
        setAvailableGenres(uniqueGenres)
      } catch (error) {
        console.error('Failed to fetch discovery data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tCommon])

  // Compute unique locations from loaded data
  const availableLocations = useMemo(() => {
    const allItems = [...artists, ...venues]
    const locations = new Set<string>()
    allItems.forEach((item) => {
      if (item.location && item.location !== tCommon('unknown')) {
        locations.add(item.location)
      }
    })
    return Array.from(locations).sort()
  }, [artists, venues, tCommon])

  // Filter Logic
  const filterItem = (item: DiscoveryItem) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGenre =
      selectedGenre === 'all' ||
      item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())

    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation

    return matchesSearch && matchesGenre && matchesLocation
  }

  const filteredArtists = artists.filter(filterItem)
  const filteredVenues = venues.filter(filterItem)

  // Combined or separate based on tab?
  // We already moved to separate sections inside "All" tab.

  // Combined list just for counting if needed, but not used for display in "All" tab anymore.
  const allFilteredCount = filteredArtists.length + filteredVenues.length

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
      <section className="relative min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(240_10%_3.9%),hsl(240_8%_8%))]" />
        <Image
          className="absolute inset-0 opacity-100 object-cover"
          src="/images/auth/hero-image-4.jpg"
          alt="Hero background"
          loading="eager"
          fill
        />
        <div className="absolute inset-0 bg-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60 opacity-50" />

        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t('hero.title')}</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        </motion.div>
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
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
                    <TabsTrigger value="all" className="gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('tabs.all')}
                    </TabsTrigger>
                    <TabsTrigger value="artists" className="gap-1.5 text-xs">
                      <Music className="w-3.5 h-3.5" />
                      {t('tabs.artists')}
                    </TabsTrigger>
                    <TabsTrigger value="venues" className="gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      {t('tabs.venues')}
                    </TabsTrigger>
                  </TabsList>
                  <div className="text-sm text-muted-foreground hidden sm:block font-medium">
                    {loading
                      ? tCommon('loading')
                      : activeTab === 'all'
                        ? t('results.found', { count: allFilteredCount })
                        : activeTab === 'artists'
                          ? t('results.foundArtists', { count: filteredArtists.length })
                          : t('results.foundVenues', { count: filteredVenues.length })}
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
                              <div className="flex items-center gap-2 mb-4">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                  <Music className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">{t('sections.artists')}</h3>
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({filteredArtists.length})
                                </span>
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
                                    <ArtistCard {...item} />
                                  </motion.div>
                                ))}
                              </motion.div>
                            </section>
                          )}

                          {filteredVenues.length > 0 && (
                            <section>
                              <div className="flex items-center gap-2 mb-4">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                  <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">{t('sections.venues')}</h3>
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({filteredVenues.length})
                                </span>
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
                                    <ArtistCard {...item} />
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
                              <ArtistCard {...item} />
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
                              <ArtistCard {...item} />
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

export default DiscoveryPage
