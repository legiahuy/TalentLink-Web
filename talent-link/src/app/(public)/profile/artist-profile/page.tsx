"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star, Music, ExternalLink, MoreHorizontal, UserPen, Plus, X, Pencil } from 'lucide-react'
import { userService } from '@/services/userService'
import { resolveMediaUrl } from '@/lib/utils'
import type { Media } from '@/types/media'
import type { User } from '@/types/user'
import type { Experience } from '@/types/experience'
import { VideoItem, videoService } from '@/services/videoService'
import { toast } from 'sonner'
import VideoModal from "@/components/portfolio/VideoModal"



function pickExperienceParagraph(exps: Experience[]): string {
  if (!exps?.length) return ''
  const parse = (s?: string | null) => (s ? Date.parse(s) : Number.POSITIVE_INFINITY)
  const sorted = [...exps].sort((a, b) => {
    const ea = parse(a.end_date), eb = parse(b.end_date)
    if (ea !== eb) return eb - ea
    const sa = parse(a.start_date), sb = parse(b.start_date)
    return sb - sa
  })
  const top = sorted.slice(0, 3)
  const withDesc = top
    .filter(x => (x.description || '').trim())
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

const ArtistProfile = () => {
  const [me, setMe] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [cacheBust, setCacheBust] = useState<number>(0)
  const [gallery, setGallery] = useState<Media[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState<{ id: string; title: string } | null>(null)
  const load = useCallback(async () => {
    try {
      const [meRes, a, c, g] = await Promise.all([
        userService.getMe().catch(() => null),
        userService.getMyAvatar().catch(() => null),
        userService.getMyCover().catch(() => null),
        userService.getMyMedia(false).catch(() => ({ media: [], total: 0 })),
      ])
      setMe(meRes)
      setAvatarUrl(a?.file_url || null)
      setCoverUrl(c?.file_url || null)
      setGallery(g.media || [])
      setCacheBust(Date.now())
      if (meRes?.id) {
        const exps = await userService.listUserExperiences(meRes.id).catch(() => [])
        setExperiences(exps)
      } else setExperiences([])
      if (meRes?.username) {
        const v = await videoService.getUserVideos(meRes.username)
        setVideos(v.items)
      }
      
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const handler = () => load()
    window.addEventListener('profile:updated' as any, handler)
    return () => window.removeEventListener('profile:updated' as any, handler)
  }, [load])

  const services = [
    { name: 'Biểu diễn tại sự kiện', price: 'Liên hệ' },
    { name: 'Thu âm vocal', price: '500.000đ/bài' },
    { name: 'Sáng tác ca khúc', price: 'Liên hệ' },
    { name: 'Dạy thanh nhạc', price: '300.000đ/buổi' },
  ]

  const trackList = [
    { id: 1, title: 'Hôm nay tôi buồn', artist: 'Phùng Khánh Linh, ft Sơn Tùng', date: 'Jul 27, 2025', length: '3.25' },
    { id: 2, title: 'Hôm nay tôi buồn', artist: 'Phùng Khánh Linh, ft Sơn Tùng', date: 'Jul 27, 2025', length: '3.25' },
    { id: 3, title: 'Hôm nay tôi buồn', artist: 'Phùng Khánh Linh, ft Sơn Tùng', date: 'Jul 27, 2025', length: '3.25' },
  ]

  const displayName = me?.display_name || '—'
  const location = [me?.city, me?.country].filter(Boolean).join(', ') || '—'
  const briefBio = (me as any)?.brief_bio || ''
  const detailBio = (me as any)?.detail_bio || ''
  const email = me?.email || ''
  const phone = (me as any)?.phone_number || ''
  const facebook = (me as any)?.facebook_url || ''
  const instagram = (me as any)?.instagram_url || ''
  const youtube = (me as any)?.youtube_url || ''
  const expParagraph = pickExperienceParagraph(experiences)

  return (
    <main className="flex-1 pt-24">
      <div className="h-64 md:h-80 bg-gradient-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${coverUrl ? `${resolveMediaUrl(coverUrl)}?v=${cacheBust}` : '/images/profile/artist-1.jpg'})`,
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
                  src={avatarUrl ? `${resolveMediaUrl(avatarUrl)}?v=${cacheBust}` : '/images/profile/artist-1.jpg'}
                  alt="Artist"
                  width={192}
                  height={192}
                  className="w-48 h-48 rounded-2xl object-cover border-4 border-background shadow-glow"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-primary rounded-full p-3">
                  <Music className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>

              <div className="md:ml-auto md:order-3">
                <Button size="lg" variant="default" asChild>
                  <Link href="/profile/edit/artist" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
                    <UserPen className="mr-2 h-5 w-5" />
                    Thay đổi thông tin
                  </Link>
                </Button>
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
                  <Badge className="bg-primary">Pop</Badge>
                  <Badge className="bg-primary">Ballad</Badge>
                  <Badge className="bg-primary">R&B</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {briefBio ||
                    `Ca sĩ với hơn 5 năm kinh nghiệm trong ngành âm nhạc. Chuyên về dòng nhạc pop và
                  ballad Việt Nam. Đã từng biểu diễn tại nhiều sự kiện lớn và có đam mê mang đến
                  những trải nghiệm âm nhạc đầy cảm xúc.`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Portfolio (Videos using API) */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Portfolio (Video)</h2>

                  <Button onClick={() => setOpenAdd(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Thêm video
                  </Button>
                </div>

                {videos.length === 0 ? (
                  <p className="text-muted-foreground">Chưa có video.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((v) => (
                      <Card key={v.id} className="overflow-hidden bg-card border-border/40 group">
                        <div className="aspect-video relative">
                        <video
                            src={v.video_url}
                            controls
                            className="w-full h-full object-cover"
                            poster={v.thumbnail_url ? resolveMediaUrl(v.thumbnail_url) : undefined}
                          />

                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            {/* Edit */}
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => {
                                setEditData({ id: v.id, title: v.title })
                                setOpenEdit(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Delete */}
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={async () => {
                                if (!confirm("Xóa video này?")) return
                                await videoService.deleteVideo(v.id)
                                setVideos((prev) => prev.filter((x) => x.id !== v.id))
                                toast.success("Đã xóa video")
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold">{v.title || "Không tiêu đề"}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(v.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>



              {/* About */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Giới thiệu</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    <div className="space-y-4 text-muted-foreground">
                      {/* ĐOẠN 1: detail_bio */}
                      <p className="whitespace-pre-line">
                        {detailBio?.trim() ||
                          `Xin chào! Tôi là ${displayName}. Tôi đam mê pop/ballad và mong muốn mang đến những trải nghiệm âm nhạc đầy cảm xúc.`}
                      </p>

                      {/* ĐOẠN 2: kinh nghiệm từ Experiences */}
                      <p className="whitespace-pre-line">
                        {expParagraph ||
                          'Tôi đã biểu diễn tại nhiều sự kiện như đám cưới, tiệc công ty, showcase nhỏ; nhận thu âm vocal & hướng dẫn thanh nhạc.'}
                      </p>

                      {/* ĐOẠN 3: CTA + liên hệ */}
                      <div className="space-y-1">
                        <p>Hãy liên hệ với tôi để thảo luận về dự án của bạn. Tôi rất mong được hợp tác!</p>
                        <p>
                          <span className="font-medium">SDT:</span>{' '}
                          {phone ? <a className="hover:text-primary" href={`tel:${phone}`}>{phone}</a> : '—'}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{' '}
                          {email ? <a className="hover:text-primary break-all" href={`mailto:${email}`}>{email}</a> : '—'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social links — dùng dữ liệu thật */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Liên kết</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6 space-y-3">
                    {youtube ? (
                      <a href={youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-4 w-4" /><span>YouTube</span>
                      </a>
                    ) : null}
                    {instagram ? (
                      <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-4 w-4" /><span>Instagram</span>
                      </a>
                    ) : null}
                    {facebook ? (
                      <a href={facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-4 w-4" /><span>Facebook</span>
                      </a>
                    ) : null}
                    {!youtube && !instagram && !facebook ? (
                      <p className="text-muted-foreground">Chưa có liên kết mạng xã hội.</p>
                    ) : null}
                  </CardContent>
                </Card>
              </section>

              {/* Dịch vụ */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Dịch vụ</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {services.map((service, index) => (
                        <div key={index} className="flex justify-between items-start pb-4 border-b border-border/40 last:border-0 last:pb-0">
                          <div className="flex-1"><h3 className="font-medium">{service.name}</h3></div>
                          <div className="text-primary font-semibold whitespace-nowrap ml-4">{service.price}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Ảnh */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Ảnh</h2>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-6">
                    {gallery.length === 0 ? (
                      <p className="text-muted-foreground">Chưa có ảnh portfolio.</p>
                    ) : (
                      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-2">
                        {gallery.slice(0, 6).map((m) => (
                          <div key={m.id} className="relative w-full aspect-square overflow-hidden rounded-lg">
                            <Image
                              unoptimized
                              src={`${resolveMediaUrl(m.file_url)}?v=${cacheBust}`}
                              alt={m.file_name}
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="w-full flex justify-center mt-4">
                      <Button variant="link" asChild><Link href="/profile/edit/artist">Hiện tất cả</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>

     {/* Đặt modal ở đây */}
     <VideoModal
      open={openAdd}
      setOpen={setOpenAdd}
      onUploaded={load}
    />

    <VideoModal
      open={openEdit}
      setOpen={setOpenEdit}
      onUploaded={load}
      init={editData || undefined}
    />  
    </main>
  )
}

export default ArtistProfile
