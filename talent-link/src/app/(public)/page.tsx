'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowRight, Music, Users, Shield } from 'lucide-react'
import ArtistCard from '@/components/artist/ArtistCard'
import EventCard from '@/components/event/EventCard'
import { useTranslations } from 'next-intl'

const LandingPage = () => {
  const t = useTranslations('LandingPage')
  const featuredArtists = [
    {
      id: '1',
      name: 'Minh Anh',
      image: '/images/auth/auth-photo-1.jpg',
      genre: 'Pop/Ballad',
      location: 'Hà Nội',
      rating: 4.9,
      description: 'Ca sĩ với giọng hát trữ tình, chuyên về nhạc pop và ballad Việt',
    },
    {
      id: '2',
      name: 'Tuấn Anh',
      image: '/images/auth/auth-photo-1.jpg',
      genre: 'Indie/Rock',
      location: 'TP. Hồ Chí Minh',
      rating: 4.8,
      description: 'Nghệ sĩ guitar indie với phong cách hiện đại và sáng tạo',
    },
    {
      id: '3',
      name: 'DJ Minh',
      image: '/images/auth/auth-photo-1.jpg',
      genre: 'EDM/House',
      location: 'TP. Hồ Chí Minh',
      rating: 4.9,
      description: 'DJ chuyên nghiệp với kinh nghiệm biểu diễn tại các sự kiện lớn',
    },
    {
      id: '4',
      name: 'Thu Hà',
      image: '/images/auth/auth-photo-1.jpg',
      genre: 'Classical/Acoustic',
      location: 'Hà Nội',
      rating: 5.0,
      description: 'Nghệ sĩ violin cổ điển với kỹ thuật tinh tế và cảm xúc sâu lắng',
    },
  ]

  const featuredEvents = [
    {
      id: '1',
      title: 'Đêm Nhạc Acoustic',
      date: '2025-11-15',
      time: '20:00',
      status: 'upcoming' as const,
      artists: ['Minh Anh', 'Thu Hà'],
      image: '/images/auth/auth-photo-1.jpg',
    },
    {
      id: '2',
      title: 'EDM Night Party',
      date: '2025-11-20',
      time: '21:00',
      status: 'upcoming' as const,
      artists: ['DJ Minh'],
      image: '/images/auth/auth-photo-1.jpg',
    },
    {
      id: '3',
      title: 'Indie Rock Live',
      date: '2025-11-25',
      time: '19:30',
      status: 'upcoming' as const,
      artists: ['Tuấn Anh'],
      image: '/images/auth/auth-photo-1.jpg',
    },
  ]
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(240_10%_3.9%),hsl(240_8%_8%))]" />
        <Image
          className="absolute inset-0 opacity-100 object-cover"
          src="/images/auth/hero-image-2.jpg"
          alt="Hero background"
          fill
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />

        <div className="mx-auto relative z-10 px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl leading-tight font-bold mb-6 text-white">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed opacity-90">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
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
          </div>

          {/* <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <span>🎤 Ca sĩ</span>
            <span>🎸 Nhạc công</span>
            <span>🎹 Producer</span>
            <span>🎧 DJ</span>
            <span>✍️ Nhạc sĩ</span>
          </div> */}
        </div>
      </section>

      <div
        className="inset-0 z-0 "
        style={{
          background: `radial-gradient(125% 125% at 50% 10%, #fff 35%, #d5c5ff 75%, #7c3aed 100%)`,
        }}
      >
        {/* Featured Artists */}
        <section className="py-20">
          <div className="mx-auto px-4 max-w-[1320px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredArtists.title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('featuredArtists.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} {...artist} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link href="/discovery">
                  {t('featuredArtists.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-20">
          <div className="mx-auto px-4 max-w-[1320px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featuredEvents.title')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('featuredEvents.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {featuredEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild className="border-primary/50">
                <Link href="/discovery">
                  {t('featuredEvents.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto px-4 max-w-[1320px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Music className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('features.diverseGenres.title')}</h3>
              <p className="text-muted-foreground">{t('features.diverseGenres.description')}</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('features.easyConnection.title')}</h3>
              <p className="text-muted-foreground">{t('features.easyConnection.description')}</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-card border border-border/40 transition-all hover:shadow-glow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t('features.professional.title')}</h3>
              <p className="text-muted-foreground">{t('features.professional.description')}</p>
            </div>
          </div>
        </div>
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
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
              <p className="text-muted-foreground text-lg mb-8">{t('cta.subtitle')}</p>
              <Button size="lg" className="bg-primary text-lg" asChild>
                <Link href="/auth/signup">
                  {t('cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default LandingPage
