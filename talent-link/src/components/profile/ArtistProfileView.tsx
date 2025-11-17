'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star, Music, ExternalLink } from 'lucide-react'
import type { User } from '@/types/user'
import type { Media } from '@/types/media'
import type { Experience } from '@/types/experience'
import type { VideoItem } from '@/services/videoService'
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
}

function pickExperienceParagraph(exps: Experience[] = []): string {
  if (!exps.length) return ''
  const parse = (s?: string | null) => (s ? Date.parse(s) : Number.POSITIVE_INFINITY)
  const sorted = [...exps].sort((a, b) => {
    const ea = parse(a.end_date)
    const eb = parse(b.end_date)
    if (ea !== eb) return eb - ea
    const sa = parse(a.start_date)
    const sb = parse(b.start_date)
    return sb - sa
  })
  const top = sorted.slice(0, 3)
  const withDesc = top
    .filter((x) => (x.description || '').trim())
    .sort((a, b) => (b.description?.length || 0) - (a.description?.length || 0))
  if (withDesc[0]?.description) return withDesc[0].description!.trim()
  const fmt = (e: Experience) => {
    const sd = e.start_date?.slice(0, 10) ?? ''
    const ed = e.end_date?.slice(0, 10) ?? 'nay'
    const title = e.title || 'Kinh nghiệm'
    return `${title} (${sd}${sd || ed ? ' - ' : ''}${ed})`
  }
  return top.map(fmt).join(' • ')
}

const staticServices = [
  { name: 'Biểu diễn tại sự kiện', price: 'Liên hệ' },
  { name: 'Thu âm vocal', price: '500.000đ/bài' },
  { name: 'Sáng tác ca khúc', price: 'Liên hệ' },
  { name: 'Dạy thanh nhạc', price: '300.000đ/buổi' },
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
  const expParagraph = pickExperienceParagraph(experiences)
  const genres = (profile.genres || []).map((g) => g.name)

  return (
    <main className="flex-1">
      <div className="h-64 md:h-80 bg-gradient-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${
              coverUrl
                ? `${resolveMediaUrl(coverUrl)}?v=${profile.updated_at ?? ''}`
                : '/images/profile/artist-1.jpg'
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative -mt-24 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative md:order-1">
                <Image
                  unoptimized
                  src={
                    avatarUrl
                      ? `${resolveMediaUrl(avatarUrl)}?v=${profile.updated_at ?? ''}`
                      : '/images/profile/artist-1.jpg'
                  }
                  alt={displayName}
                  width={192}
                  height={192}
                  className="w-48 h-48 rounded-2xl object-cover border-4 border-background shadow-glow"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-primary rounded-full p-3">
                  <Music className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>

              <div className="md:ml-auto md:order-3">
                {isOwner ? (
                  <Button size="lg" onClick={onEdit} className="flex items-center gap-2">
                    Chỉnh sửa hồ sơ
                  </Button>
                ) : (
                  <Button size="lg" variant="default" asChild>
                    <Link
                      href="/booking"
                      className="flex items-center gap-2 text-white hover:text-primary transition-colors"
                    >
                      Liên hệ hợp tác
                    </Link>
                  </Button>
                )}
              </div>

              <div className="flex-1 pt-0 md:order-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-start flex-wrap gap-4 md:gap-6 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{displayName}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">4.9</span>
                        <span>(28 đánh giá)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {genres.length
                    ? genres.map((genre) => (
                        <Badge key={genre} className="bg-primary">
                          {genre}
                        </Badge>
                      ))
                    : ['Pop', 'Ballad', 'R&B'].map((genre) => (
                        <Badge key={genre} className="bg-primary">
                          {genre}
                        </Badge>
                      ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {briefBio ||
                    `Ca sĩ với hơn 5 năm kinh nghiệm trong ngành âm nhạc. Chuyên về dòng nhạc pop và ballad Việt Nam.`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Portfolio (Video)</h2>
                </div>

                {videos.length === 0 ? (
                  <p className="text-muted-foreground">Chưa có video.</p>
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
                          <h3 className="font-semibold">{video.title || 'Không tiêu đề'}</h3>
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
                <h2 className="text-2xl font-semibold mb-4">Giới thiệu</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    <div className="space-y-4 text-muted-foreground">
                      <p className="whitespace-pre-line">
                        {detailBio?.trim() ||
                          `Xin chào! Tôi là ${displayName}. Tôi đam mê pop/ballad và mong muốn mang đến những trải nghiệm âm nhạc đầy cảm xúc.`}
                      </p>
                      <p className="whitespace-pre-line">
                        {expParagraph ||
                          'Tôi đã biểu diễn tại nhiều sự kiện như đám cưới, tiệc công ty, showcase nhỏ; nhận thu âm vocal & hướng dẫn thanh nhạc.'}
                      </p>
                      <div className="space-y-1">
                        <p>
                          Hãy liên hệ với tôi để thảo luận về dự án của bạn. Tôi rất mong được hợp
                          tác!
                        </p>
                        <p>
                          <span className="font-medium">SDT:</span>{' '}
                          {phone ? (
                            <a className="hover:text-primary" href={`tel:${phone}`}>
                              {phone}
                            </a>
                          ) : (
                            '—'
                          )}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{' '}
                          {email ? (
                            <a className="hover:text-primary break-all" href={`mailto:${email}`}>
                              {email}
                            </a>
                          ) : (
                            '—'
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Liên kết</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6 space-y-3">
                    {youtube ? (
                      <a
                        href={youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>YouTube</span>
                      </a>
                    ) : null}
                    {instagram ? (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Instagram</span>
                      </a>
                    ) : null}
                    {facebook ? (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Facebook</span>
                      </a>
                    ) : null}
                    {!youtube && !instagram && !facebook ? (
                      <p className="text-muted-foreground">Chưa có liên kết mạng xã hội.</p>
                    ) : null}
                  </CardContent>
                </Card>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Dịch vụ</h2>
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
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Ảnh</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    {gallery.length === 0 ? (
                      <p className="text-muted-foreground">Chưa có ảnh portfolio.</p>
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
