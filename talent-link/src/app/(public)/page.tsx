'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowRight, Music, Users, Shield } from 'lucide-react'
import ArtistCard from '@/components/artist/ArtistCard'
import EventCard from '@/components/event/EventCard'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import { landingService } from '@/services/landingService'
import type { FeaturedUser, FeaturedJob } from '@/types/admin'

const LandingPage = () => {
  const t = useTranslations('LandingPage')
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([])
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const [users, jobs] = await Promise.all([
          landingService.getFeaturedUsers(4),
          landingService.getFeaturedJobs(3),
        ])

        // Transform FeaturedUser to ArtistCard format
        const transformedUsers = users.map((user: FeaturedUser) => ({
          id: user.id,
          name: user.display_name,
          image: user.avatar_url || '/images/auth/auth-photo-1.jpg',
          genre: user.genres?.map((g) => g.name).join('/') || user.role,
          location: [user.city, user.country].filter(Boolean).join(', '),
          rating: user.is_verified ? 5.0 : 4.5,
          description: user.brief_bio || '',
        }))

        // Transform FeaturedJob to EventCard format
        const transformedJobs = jobs.map((job: FeaturedJob) => ({
          id: job.id,
          title: job.title,
          date: job.deadline || new Date().toISOString(),
          time: '20:00',
          status: 'upcoming' as const,
          artists: [job.creator_name || job.creator_username || 'Unknown'],
          image: '/images/auth/auth-photo-1.jpg',
        }))

        setFeaturedArtists(transformedUsers)
        setFeaturedEvents(transformedJobs)
      } catch (error) {
        console.error('Failed to fetch featured content:', error)
        // Keep empty arrays as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedContent()
  }, [])

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(240_10%_3.9%),hsl(240_8%_8%))]" />
        <Image
          className="absolute inset-0 opacity-100 object-cover"
          src="/images/auth/hero-image-4.jpg"
          alt="Hero background"
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
                placeholder={t('hero.searchPlaceholder')}
                className="pl-10 bg-card/50 backdrop-blur border-border/40 h-10"
              />
            </div>
            <Button size="lg" variant="default" asChild>
              <Link href="/discovery">
                {t('hero.exploreButton')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
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
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredArtists.title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('featuredArtists.subtitle')}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
            >
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-96 rounded-xl border border-border bg-card animate-pulse" />
                ))
              ) : featuredArtists.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No featured artists available</p>
                </div>
              ) : (
                featuredArtists.map((artist) => (
                  <motion.div key={artist.id} variants={fadeInUp}>
                    <ArtistCard {...artist} />
                  </motion.div>
                ))
              )}
            </motion.div>

            <motion.div className="text-center mt-12" variants={fadeInUp}>
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link href="/discovery">
                  {t('featuredArtists.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Events */}
        <section className="py-20">
          <motion.div
            className="mx-auto px-4 max-w-[1320px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredEvents.title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('featuredEvents.subtitle')}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
              variants={staggerContainer}
            >
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-xl border border-border bg-card animate-pulse" />
                ))
              ) : featuredEvents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No featured events available</p>
                </div>
              ) : (
                featuredEvents.map((event, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <EventCard event={event} />
                  </motion.div>
                ))
              )}
            </motion.div>

            <motion.div className="text-center mt-12" variants={fadeInUp}>
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link href="/discovery">
                  {t('featuredEvents.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Features */}
      <section className="py-20">
        <motion.div
          className="mx-auto px-4 max-w-[1320px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
          >
            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow"
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Music className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('features.diverseGenres.title')}</h3>
              <p className="text-muted-foreground">{t('features.diverseGenres.description')}</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow"
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('features.easyConnection.title')}</h3>
              <p className="text-muted-foreground">{t('features.easyConnection.description')}</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow"
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('features.professional.title')}</h3>
              <p className="text-muted-foreground">{t('features.professional.description')}</p>
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
              <Button size="lg" className="bg-primary text-lg" asChild>
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

export default LandingPage
