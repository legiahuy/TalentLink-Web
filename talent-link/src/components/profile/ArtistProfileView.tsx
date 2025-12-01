'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Star, Music, MicVocal, Youtube, Facebook, Instagram } from 'lucide-react'
import type { User } from '@/types/user'
import type { Media } from '@/types/media'
import type { Experience } from '@/types/experience'
import type { VideoItem } from '@/types/video'
import { resolveMediaUrl } from '@/lib/utils'

interface ArtistProfileViewProps {
  profile: User
  avatarUrl?: string | null
  coverUrl?: string | null
  gallery?: Media[]
  experiences?: Experience[]
  videos?: VideoItem[]
  isOwner: boolean
  onEdit?: () => void
  loadingVideos?: boolean
  loadingExperiences?: boolean
  loadingGallery?: boolean
}

const staticServices = [
  { name: 'Event Performance', price: 'Contact' },
  { name: 'Vocal Recording', price: '500,000 VND/song' },
  { name: 'Songwriting', price: 'Contact' },
  { name: 'Vocal Lessons', price: '300,000 VND/session' },
]

export function ArtistProfileView({
  profile,
  avatarUrl,
  coverUrl,
  gallery = [],
  experiences = [],
  videos = [],
  isOwner,
  onEdit,
  loadingVideos = false,
  loadingExperiences = false,
  loadingGallery = false,
}: ArtistProfileViewProps) {
  const displayName = profile.display_name || profile.username
  const location = [profile.city, profile.country].filter(Boolean).join(', ') || '—'
  const briefBio = (profile as any)?.brief_bio || ''
  const detailBio = (profile as any)?.detail_bio || ''
  const email = profile.email || ''
  const phone = (profile as any)?.phone_number || ''
  const facebook = (profile as any)?.facebook_url || ''
  const instagram = (profile as any)?.instagram_url || ''
  const youtube = (profile as any)?.youtube_url || ''
  const genres = (profile.genres || []).map((g) => g.name)

  // Sort experiences by end date (most recent first), then by start date
  const sortedExperiences = [...experiences].sort((a, b) => {
    const parse = (s?: string | null) => (s ? Date.parse(s) : Number.POSITIVE_INFINITY)
    const ea = parse(a.end_date)
    const eb = parse(b.end_date)
    if (ea !== eb) return eb - ea
    const sa = parse(a.start_date)
    const sb = parse(b.start_date)
    return sb - sa
  })

  return (
    <main className="flex-1">
      <div className="h-80 md:h-100 bg-gradient-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: `url(${
              coverUrl
                ? `${resolveMediaUrl(coverUrl)}?v=${profile.updated_at ?? ''}`
                : '/images/profile/background-default.jpg'
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative -mt-24 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative shrink-0 md:order-1">
                <Image
                  unoptimized
                  src={
                    avatarUrl
                      ? `${resolveMediaUrl(avatarUrl)}?v=${profile.updated_at ?? ''}`
                      : '/images/profile/avatar-default.svg'
                  }
                  alt={displayName}
                  width={192}
                  height={192}
                  className="w-48 h-48 rounded-2xl object-cover border-4 border-background shadow-glow"
                />

                <label className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                  {profile.role === 'producer' ? (
                    <Music className="h-5 w-5" />
                  ) : (
                    <MicVocal className="h-5 w-5" />
                  )}
                </label>
              </div>

              <div className="flex-1 w-full md:order-2 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{displayName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent" />
                    <span className="font-semibold">—</span>
                    <span>(0 reviews)</span>
                  </div>
                </div>

                {genres.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {genres.map((genre) => (
                      <Badge key={genre} className="bg-primary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                ) : isOwner ? (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground italic">
                      Add genres to help organizers find you
                    </p>
                  </div>
                ) : null}

                <p className="text-muted-foreground leading-relaxed max-w-full">
                  {briefBio || 'No headline available yet.'}
                </p>
              </div>

              <div className="w-full md:w-auto md:ml-auto md:order-3">
                {isOwner ? (
                  <Button
                    size="lg"
                    onClick={onEdit}
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button size="lg" variant="default" asChild className="w-full md:w-auto">
                    <Link
                      href="/booking"
                      className="flex items-center justify-center gap-2 text-white hover:text-primary transition-colors"
                    >
                      Contact for Collaboration
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Portfolio (Video)</h2>
                </div>

                {loadingVideos ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <Card key={i} className="overflow-hidden bg-card border-border/40">
                        <Skeleton className="aspect-video w-full" />
                        <CardContent className="p-4 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : videos.length === 0 ? (
                  <p className="text-muted-foreground">No videos yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <Card
                        key={video.id}
                        className="overflow-hidden bg-card border-border/40 group"
                      >
                        <div className="aspect-video relative">
                          <video
                            src={video.video_url}
                            controls
                            className="w-full h-full object-cover"
                            poster={
                              video.thumbnail_url ? resolveMediaUrl(video.thumbnail_url) : undefined
                            }
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{video.title || 'No title'}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(video.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    <div className="space-y-4 text-muted-foreground">
                      {detailBio?.trim() ? (
                        <p className="whitespace-pre-line">{detailBio.trim()}</p>
                      ) : (
                        <p className="text-muted-foreground/70">No detailed bio available yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Experience</h2>
                {loadingExperiences ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-card border-border/40">
                        <CardContent className="p-6 space-y-3">
                          <Skeleton className="h-6 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : sortedExperiences.length === 0 ? (
                  <Card className="bg-card border-border/40">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground">
                        No experience information available yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {sortedExperiences.map((experience, index) => (
                      <Card
                        key={experience.id || `experience-${index}`}
                        className="bg-card border-border/40"
                      >
                        <CardContent className="p-6">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">
                              {experience.title || 'No title set'}
                            </h3>
                            {(experience.start_date || experience.end_date) && (
                              <p className="text-sm text-muted-foreground">
                                {experience.start_date
                                  ? new Date(experience.start_date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                    })
                                  : 'Start date not set'}{' '}
                                -{' '}
                                {experience.end_date
                                  ? new Date(experience.end_date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                    })
                                  : 'Present'}
                              </p>
                            )}
                            {experience.description && (
                              <p className="text-muted-foreground whitespace-pre-line">
                                {experience.description}
                              </p>
                            )}
                            {experience.portfolio_url && (
                              <a
                                href={experience.portfolio_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                {experience.portfolio_url}
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6 min-w-0">
              <section className="min-w-0">
                <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6 space-y-3 min-w-0">
                    {instagram ? (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary min-w-0"
                      >
                        <Instagram className="h-5 w-5 shrink-0" />
                        <span className="truncate">Instagram</span>
                      </a>
                    ) : null}
                    {facebook ? (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary min-w-0"
                      >
                        <Facebook className="h-5 w-5 shrink-0" />
                        <span className="truncate">Facebook</span>
                      </a>
                    ) : null}
                    {youtube ? (
                      <a
                        href={youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary min-w-0"
                      >
                        <Youtube className="h-5 w-5 shrink-0" />
                        <span className="truncate">YouTube</span>
                      </a>
                    ) : null}
                    {!youtube && !instagram && !facebook ? (
                      <p className="text-muted-foreground">No social media links yet.</p>
                    ) : null}
                  </CardContent>
                </Card>
              </section>

              {/* <section>
                <h2 className="text-2xl font-semibold mb-4">Services</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {staticServices.map((service) => (
                        <div
                          key={service.name}
                          className="flex justify-between items-start pb-4 border-b border-border/40 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium">{service.name}</h3>
                          </div>
                          <div className="text-primary font-semibold whitespace-nowrap ml-4">
                            {service.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section> */}

              <section>
                <h2 className="text-2xl font-semibold mb-4">Photos</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    {loadingGallery ? (
                      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                        ))}
                      </div>
                    ) : gallery.length === 0 ? (
                      <p className="text-muted-foreground">No portfolio photos yet.</p>
                    ) : (
                      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-2">
                        {gallery.slice(0, 6).map((media) => (
                          <div
                            key={media.id}
                            className="relative w-full aspect-square overflow-hidden rounded-lg"
                          >
                            <Image
                              unoptimized
                              src={`${resolveMediaUrl(media.file_url)}?v=${media.updated_at ?? ''}`}
                              alt={media.file_name}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ArtistProfileView
