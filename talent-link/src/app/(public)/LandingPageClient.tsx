'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, ArrowRight, Music, Users, Shield, Briefcase } from 'lucide-react'
import ArtistCard from '@/components/artist/ArtistCard'
import JobCard from '@/components/jobs/JobCard'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import { searchService } from '@/services/searchService'
import type { JobPostSearchDto, JobPost } from '@/types/job'
import type { UserSearchDto } from '@/types/search'
import { resolveMediaUrl } from '@/lib/utils'
import { useSavedJobs } from '@/hooks/useSavedJobs'
import { StaticImageData } from 'next/image'

export interface ArtistData {
  id: string
  name: string
  username: string
  image: string | StaticImageData
  genres: string[]
  location: string
  rating?: number
  description?: string
  role: string
}

interface LandingPageClientProps {
  artists: ArtistData[]
  jobs: JobPost[]
}

const LandingPageClient = ({ artists, jobs }: LandingPageClientProps) => {
  const t = useTranslations('LandingPage')
  const tCommon = useTranslations('Common')
  const tOptions = useTranslations('options')
  const router = useRouter()
  const { toggleSave, isJobSaved } = useSavedJobs()

  // -- Search State --
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{
    jobs: JobPostSearchDto[]
    users: UserSearchDto[]
  } | null>(null)
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // -- Autocomplete Logic --
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = searchQuery.trim()
    if (!q) {
      setSuggestions(null)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingSuggest(true)
        const result = await searchService.searchAll(q)
        setSuggestions({
          jobs: result.jobs.jobPosts || [],
          users: result.users.userProfiles || [],
        })
      } catch (error) {
        console.error('Autocomplete search failed', error)
        setSuggestions(null)
      } finally {
        setLoadingSuggest(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const handleToggleSave = (jobId: string) => {
    toggleSave(jobId)
  }

  // -- Animations --
  const fadeInUp: Variants = {
    hidden: { opacity: 0.2, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[850px] flex items-center justify-center overflow-hidden">
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
          className="mx-auto relative z-10 px-4 py-20 text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="text-5xl md:text-7xl leading-tight font-bold mb-6 text-white"
            variants={fadeInUp}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed opacity-90"
            variants={fadeInUp}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8"
            variants={fadeInUp}
          >
            <div className="relative flex-1">
              <Search className="absolute z-1 left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="pl-10 bg-card/50 backdrop-blur border-border/40 h-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = searchQuery.trim()
                    if (q) router.push(`/search?query=${encodeURIComponent(q)}`)
                  }
                }}
              />
              {suggestions && (suggestions.jobs.length > 0 || suggestions.users.length > 0) && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-border/60 bg-background shadow-lg max-h-64 overflow-y-auto z-20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50">
                  {suggestions.users.map((u) => {
                    const avatarSrc = u.avatarUrl ? resolveMediaUrl(u.avatarUrl) : undefined
                    const fallback = (u.displayName || u.username || '?').charAt(0).toUpperCase()
                    return (
                      <Link
                        key={`u-${u.id}`}
                        href={`/profile/${u.username}`}
                        className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center gap-3"
                        onClick={() => setSuggestions(null)}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={avatarSrc} alt={u.displayName || u.username} />
                          <AvatarFallback>{fallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate text-start">
                            {u.displayName || u.username}
                          </div>
                          <div className="text-xs text-muted-foreground truncate text-start">
                            {u.role === 'venue' ? tOptions('roles.venue') : tOptions('roles.artist')}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  {suggestions.jobs.map((j) => (
                    <Link
                      key={`j-${j.id}`}
                      href={`/jobs/${j.id}`}
                      className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center gap-3"
                      onClick={() => setSuggestions(null)}
                    >
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate text-start">{j.title}</div>
                        <div className="text-xs text-muted-foreground truncate text-start">
                          {j.creatorDisplayName || j.creatorUsername || j.creatorRole}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {loadingSuggest && (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      {tCommon('loading')}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              size="lg"
              variant="default"
              onClick={() => {
                const q = searchQuery.trim()
                if (q) router.push(`/search?query=${encodeURIComponent(q)}`)
              }}
            >
              {t('hero.exploreButton')} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <div
        className="inset-0 z-0 "
        style={{
          background: `radial-gradient(125% 125% at 50% 10%, #fff 35%, #d5c5ff 75%, #7c3aed 100%)`,
        }}
      >
        {/* Featured Artists */}
        <section className="py-20">
          <motion.div
            className="mx-auto px-4 max-w-[1320px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredArtists.title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('featuredArtists.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {!artists || artists.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">{t('featuredArtists.noResults')}</p>
                </div>
              ) : (
                artists.map((artist) => (
                  <motion.div key={artist.id} variants={fadeInUp} className="h-full">
                    <ArtistCard
                      {...artist}
                      roleLabel={tOptions(`roles.${artist.role}`)}
                    />
                  </motion.div>
                ))
              )}
            </div>

            <motion.div className="text-center mt-12" variants={fadeInUp}>
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link href="/discovery">
                  {t('featuredArtists.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Jobs */}
        <section className="py-20">
          <motion.div
            className="mx-auto px-4 max-w-[1320px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredJobs.title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('featuredJobs.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {!jobs || jobs.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">{t('featuredJobs.noResults')}</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <motion.div key={job.id} variants={fadeInUp} className="h-full">
                    <Link href={`/jobs/${job.id}`} className="block h-full cursor-pointer hover:no-underline">
                      <JobCard
                        job={job}
                        onToggleSave={handleToggleSave}
                        isSaved={isJobSaved(job.id)}
                        hideFooter={true}
                      />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>

            <motion.div className="text-center mt-12" variants={fadeInUp}>
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link href="/jobs">
                  {t('featuredJobs.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Features */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <motion.div
          className="mx-auto px-4 max-w-[1320px] relative z-10"
          initial="hidden"
          whileInView="show"
          viewport={{ margin: '-50px' }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
          >
            <motion.div
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm border border-border/10 transition-all duration-300 hover:from-primary/8 hover:to-primary/3 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                  <Music className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {t('features.diverseGenres.title')}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {t('features.diverseGenres.description')}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm border border-border/10 transition-all duration-300 hover:from-primary/8 hover:to-primary/3 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                  <Users className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {t('features.easyConnection.title')}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {t('features.easyConnection.description')}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm border border-border/10 transition-all duration-300 hover:from-primary/8 hover:to-primary/3 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                  <Shield className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {t('features.professional.title')}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {t('features.professional.description')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <div
        className="inset-0 z-0"
        style={{
          backgroundImage: `
       linear-gradient(to right, #f0f0f0 1px, transparent 1px),
       linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
       radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),     /* Left */
       radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent),  /* Right */
       radial-gradient(circle 600px at 50% 0px, #d5c5ff, transparent),     /* Top */
       radial-gradient(circle 600px at 50% 100%, #d5c5ff, transparent)     /* Bottom */
     `,
          backgroundSize: `
       96px 64px,    
       96px 64px,    
       100% 100%,    
       100% 100%,
       100% 100%,
       100% 100%
     `,
        }}
      >
        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto px-4 max-w-[1320px]">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
              <p className="text-muted-foreground text-lg mb-8">{t('cta.subtitle')}</p>
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  {t('cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LandingPageClient
