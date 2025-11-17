'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Loader2, Camera, Save, UploadCloud, X, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

import type { Media } from '@/types/media'
import type { User } from '@/types/user'
import type { Experience } from '@/types/experience'
import { userService } from '@/services/userService'
import { VideoItem, videoService } from '@/services/videoService'
import VideoModal from '@/components/portfolio/VideoModal'

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'media', label: 'Ảnh & Video' },
  { id: 'experience', label: 'Kinh nghiệm' },
  { id: 'contact', label: 'Liên hệ & mạng xã hội' },
]

interface SectionCardProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}

const SectionCard = ({ title, description, action, children }: SectionCardProps) => (
  <Card>
    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </div>
      {action}
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
)

const placeholderGenres = ['Pop', 'Ballad', 'R&B']

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object') {
    const maybe = error as { response?: { data?: { message?: string } } }
    const apiMessage = maybe.response?.data?.message
    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage
    }
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export default function ArtistProfileEditor() {
  const [loading, setLoading] = useState(true)

  const [me, setMe] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [cacheBust, setCacheBust] = useState<number>(Date.now())
  const [gallery, setGallery] = useState<Media[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [openAddVideo, setOpenAddVideo] = useState(false)
  const [editVideoData, setEditVideoData] = useState<{ id: string; title: string } | null>(null)
  const [openEditVideo, setOpenEditVideo] = useState(false)

  const [savingBasic, setSavingBasic] = useState(false)
  const [savingImages, setSavingImages] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [savingSocial, setSavingSocial] = useState(false)
  const [savingExp, setSavingExp] = useState(false)
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null)

  const [formBasic, setFormBasic] = useState({
    display_name: '',
    brief_bio: '',
    detail_bio: '',
    city: '',
    country: '',
    genres: [] as string[],
  })

  const [formContact, setFormContact] = useState({
    email: '',
    phone_number: '',
  })

  const [formSocial, setFormSocial] = useState({
    youtube_url: '',
    instagram_url: '',
    facebook_url: '',
  })

  const [expForm, setExpForm] = useState<{
    id?: string
    title: string
    description: string
    portfolio_url: string
  }>({
    title: '',
    description: '',
    portfolio_url: '',
  })

  const heroName = me?.display_name || me?.username || 'Nghệ sĩ'

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true)
        const meRes = await userService.getMe().catch(() => null)
        if (meRes) {
          setMe(meRes)
          const normalizedGenres = (meRes.genres ?? []).map((genre) => genre.name).filter(Boolean)
          setFormBasic({
            display_name: meRes.display_name ?? '',
            brief_bio: meRes.brief_bio ?? '',
            detail_bio: meRes.detail_bio ?? '',
            city: meRes.city ?? '',
            country: meRes.country ?? '',
            genres: normalizedGenres,
          })
          setFormContact({
            email: meRes.email ?? '',
            phone_number: meRes.phone_number ?? '',
          })
          setFormSocial({
            youtube_url: meRes.youtube_url ?? '',
            instagram_url: meRes.instagram_url ?? '',
            facebook_url: meRes.facebook_url ?? '',
          })
          try {
            const exps = await userService.listUserExperiences(meRes.id)
            setExperiences(exps || [])
          } catch {
            setExperiences([])
          }
          if (meRes.username) {
            const videoRes = await videoService.getUserVideos(meRes.username)
            setVideos(videoRes.items)
          }
        }
        const [mediaRes, avatarRes, coverRes] = await Promise.all([
          userService.getMyMedia(false).catch(() => ({ media: [], total: 0 })),
          userService.getMyAvatar().catch(() => null),
          userService.getMyCover().catch(() => null),
        ])
        setGallery(mediaRes.media || [])
        setAvatarUrl(avatarRes?.file_url || meRes?.avatar_url || null)
        setCoverUrl(coverRes?.file_url || meRes?.cover_url || null)
        setCacheBust(Date.now())
      } catch (error) {
        console.error(error)
        toast.error('Không thể tải dữ liệu hồ sơ')
      } finally {
        setLoading(false)
      }
    }
    loadInitial()
  }, [])

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setAvatarPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setAvatarPreviewUrl(null)
  }, [avatarFile])

  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile)
      setCoverPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setCoverPreviewUrl(null)
  }, [coverFile])

  const onBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormBasic((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const onContactChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormContact((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const onSocialChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormSocial((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSaveBasic = async (event?: React.FormEvent) => {
    event?.preventDefault()
    try {
      setSavingBasic(true)
      const payload = {
        display_name: formBasic.display_name.trim() || undefined,
        brief_bio: formBasic.brief_bio.trim() || undefined,
        detail_bio: formBasic.detail_bio.trim() || undefined,
        city: formBasic.city.trim() || undefined,
        country: formBasic.country.trim() || undefined,
      }
      const updated = await userService.updateBasic(payload)
      toast.success('Đã lưu thông tin cơ bản')
      setMe((prev) => (prev ? { ...prev, ...updated } : prev))
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Cập nhật thất bại')
      toast.error(message)
    } finally {
      setSavingBasic(false)
    }
  }

  const handleSaveImages = async () => {
    try {
      setSavingImages(true)
      let changed = false
      if (avatarFile) {
        await userService.uploadAvatar(avatarFile)
        changed = true
      }
      if (coverFile) {
        await userService.uploadCover(coverFile)
        changed = true
      }
      if (changed) {
        toast.success('Đã cập nhật ảnh hồ sơ')
        setAvatarFile(null)
        setCoverFile(null)
        setAvatarPreviewUrl(null)
        setCoverPreviewUrl(null)
        setCacheBust(Date.now())
        window.dispatchEvent(
          new CustomEvent('profile:updated', { detail: { what: 'avatar:cover' } }),
        )
      } else {
        toast.message('Không có thay đổi ảnh')
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Lưu ảnh thất bại')
      toast.error(message)
    } finally {
      setSavingImages(false)
    }
  }

  const handleAddGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    try {
      setUploadingGallery(true)
      for (const file of files) {
        const media = await userService.uploadMedia(file)
        setGallery((prev) => [media, ...prev])
      }
      toast.success(`Đã tải lên ${files.length} ảnh`)
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'media:add' } }))
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Tải ảnh thất bại')
      toast.error(message)
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Xoá ảnh này khỏi thư viện?')) return
    const prev = gallery
    setDeletingId(id)
    setGallery((g) => g.filter((m) => m.id !== id))
    try {
      await userService.deleteMedia(id)
      toast.success('Đã xoá ảnh')
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'media:delete' } }))
    } catch (error: unknown) {
      console.error(error)
      setGallery(prev)
      const message = getErrorMessage(error, 'Xoá ảnh thất bại')
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveContact = async () => {
    try {
      setSavingContact(true)
      const updated = await userService.updateContact({
        email: formContact.email?.trim() || undefined,
        phone_number: formContact.phone_number?.trim() || undefined,
      })
      toast.success('Đã lưu thông tin liên hệ')
      setFormContact({
        email: updated.email ?? formContact.email,
        phone_number: updated.phone_number ?? formContact.phone_number,
      })
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'contact' } }))
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Cập nhật liên hệ thất bại')
      toast.error(message)
    } finally {
      setSavingContact(false)
    }
  }

  const handleSaveSocial = async () => {
    try {
      setSavingSocial(true)
      const updated = await userService.updateSocial({
        youtube_url: formSocial.youtube_url?.trim() || undefined,
        instagram_url: formSocial.instagram_url?.trim() || undefined,
        facebook_url: formSocial.facebook_url?.trim() || undefined,
      })
      toast.success('Đã lưu liên kết mạng xã hội')
      setFormSocial({
        youtube_url: updated.youtube_url ?? formSocial.youtube_url,
        instagram_url: updated.instagram_url ?? formSocial.instagram_url,
        facebook_url: updated.facebook_url ?? formSocial.facebook_url,
      })
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'social' } }))
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Cập nhật mạng xã hội thất bại')
      toast.error(message)
    } finally {
      setSavingSocial(false)
    }
  }

  const handleSaveExperience = async () => {
    if (!me?.id) {
      toast.error('Bạn cần đăng nhập')
      return
    }
    if (!expForm.description.trim() && !expForm.title.trim()) {
      toast.error('Nhập ít nhất mô tả hoặc chuyên môn')
      return
    }
    try {
      setSavingExp(true)
      if (expForm.id) {
        const updated = await userService.updateExperience(expForm.id, {
          title: expForm.title || undefined,
          description: expForm.description || undefined,
          portfolio_url: expForm.portfolio_url || undefined,
        })
        setExperiences((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
        toast.success('Đã cập nhật kinh nghiệm')
      } else {
        const created = await userService.createExperience({
          title: expForm.title || undefined,
          description: expForm.description || undefined,
          portfolio_url: expForm.portfolio_url || undefined,
        })
        setExperiences((prev) => [created, ...prev])
        toast.success('Đã thêm kinh nghiệm')
      }
      setExpForm({ id: undefined, title: '', description: '', portfolio_url: '' })
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'experience' } }))
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Lưu kinh nghiệm thất bại')
      toast.error(message)
    } finally {
      setSavingExp(false)
    }
  }

  const handleEditExperience = (exp: Experience) => {
    setExpForm({
      id: exp.id,
      title: exp.title || '',
      description: exp.description || '',
      portfolio_url: exp.portfolio_url || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm('Xoá mục kinh nghiệm này?')) return
    try {
      setDeletingExpId(id)
      await userService.deleteExperience(id)
      setExperiences((prev) => prev.filter((e) => e.id !== id))
      toast.success('Đã xoá kinh nghiệm')
      if (expForm.id === id)
        setExpForm({ id: undefined, title: '', description: '', portfolio_url: '' })
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Xoá kinh nghiệm thất bại')
      toast.error(message)
    } finally {
      setDeletingExpId(null)
    }
  }

  const handleVideoDeleted = async (videoId: string) => {
    try {
      await videoService.deleteVideo(videoId)
      setVideos((prev) => prev.filter((v) => v.id !== videoId))
      toast.success('Đã xoá video')
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Xoá video thất bại')
      toast.error(message)
    }
  }

  const refreshVideos = useCallback(async () => {
    if (!me?.username) return
    const res = await videoService.getUserVideos(me.username)
    setVideos(res.items)
  }, [me?.username])

  useEffect(() => {
    if (!openAddVideo && !openEditVideo) {
      refreshVideos()
    }
  }, [openAddVideo, openEditVideo, refreshVideos])

  const genresToRender = useMemo(() => {
    if (formBasic.genres.length) return formBasic.genres
    return placeholderGenres
  }, [formBasic.genres])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 md:px-8 pt-20 pb-16 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cài đặt
        </p>
        <h1 className="text-3xl font-semibold">Quản lý hồ sơ của bạn</h1>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin để hồ sơ luôn nổi bật với khách hàng.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="px-4 py-2 capitalize">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <Card>
            <div className="overflow-hidden rounded-xl">
              <div className="relative h-52 w-full">
                <Image
                  unoptimized
                  src={
                    coverPreviewUrl
                      ? coverPreviewUrl
                      : coverUrl
                        ? `${coverUrl}?v=${cacheBust}`
                        : '/images/profile/artist-1.jpg'
                  }
                  alt="Cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/30 to-transparent" />
                <div className="absolute inset-x-4 top-4 flex justify-end">
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow">
                      <UploadCloud className="h-4 w-4" />
                      <span>Đổi ảnh bìa</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    <Button size="sm" onClick={handleSaveImages} disabled={savingImages}>
                      <Save className="mr-2 h-4 w-4" />
                      {savingImages ? 'Đang lưu...' : 'Lưu ảnh'}
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Image
                      unoptimized
                      src={
                        avatarPreviewUrl
                          ? avatarPreviewUrl
                          : avatarUrl
                            ? `${avatarUrl}?v=${cacheBust}`
                            : '/images/profile/artist-1.jpg'
                      }
                      alt={heroName}
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-2xl border-4 border-background object-cover shadow-lg"
                    />
                    <label className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Hồ sơ nghệ sĩ
                      </p>
                      <h2 className="text-2xl font-semibold">{heroName}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formBasic.city || formBasic.country
                        ? `${formBasic.city}, ${formBasic.country}`
                        : 'Chưa cập nhật địa điểm'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {genresToRender.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          <SectionCard
            title="Thông tin chính"
            description="Chia sẻ những gì nổi bật nhất về bạn để thu hút nhà tổ chức."
            action={
              <Button onClick={handleSaveBasic} disabled={savingBasic}>
                <Save className="mr-2 h-4 w-4" />
                {savingBasic ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            }
          >
            <form className="space-y-4" onSubmit={handleSaveBasic}>
              <div>
                <Label htmlFor="display_name">Nghệ danh *</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  value={formBasic.display_name}
                  onChange={onBasicChange}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="city">Thành phố *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formBasic.city}
                    onChange={onBasicChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Quốc gia *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formBasic.country}
                    onChange={onBasicChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="brief_bio">Giới thiệu ngắn *</Label>
                <textarea
                  id="brief_bio"
                  name="brief_bio"
                  rows={3}
                  value={formBasic.brief_bio}
                  onChange={onBasicChange}
                  placeholder="Tóm tắt nhanh về phong cách và thế mạnh của bạn"
                  className="w-full rounded-md border bg-background p-3"
                />
              </div>
              <div>
                <Label htmlFor="detail_bio">Giới thiệu chi tiết</Label>
                <textarea
                  id="detail_bio"
                  name="detail_bio"
                  rows={5}
                  value={formBasic.detail_bio}
                  onChange={onBasicChange}
                  placeholder="Kể thêm về các dự án, thành tựu hoặc câu chuyện thương hiệu cá nhân."
                  className="w-full rounded-md border bg-background p-3"
                />
              </div>
            </form>
          </SectionCard>
        </TabsContent>

        <TabsContent value="media" className="space-y-8">
          <SectionCard
            title="Ảnh hồ sơ"
            description="Ảnh đại diện và ảnh bìa sẽ xuất hiện ở trang hồ sơ công khai của bạn."
            action={
              <Button onClick={handleSaveImages} disabled={savingImages}>
                <Save className="mr-2 h-4 w-4" />
                {savingImages ? 'Đang lưu...' : 'Lưu ảnh'}
              </Button>
            }
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Ảnh đại diện</Label>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border bg-muted">
                    {avatarPreviewUrl || avatarUrl ? (
                      <Image
                        unoptimized
                        src={avatarPreviewUrl || `${avatarUrl}?v=${cacheBust}`}
                        alt="Avatar preview"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="mx-auto my-5 h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <label className="flex flex-1 cursor-pointer flex-col gap-1 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                    Tải ảnh JPG hoặc PNG (tối đa 5MB)
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Ảnh bìa</Label>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="h-20 w-32 overflow-hidden rounded-lg border bg-muted">
                    {coverPreviewUrl || coverUrl ? (
                      <Image
                        unoptimized
                        src={coverPreviewUrl || `${coverUrl}?v=${cacheBust}`}
                        alt="Cover preview"
                        width={160}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Camera className="mx-auto my-5 h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <label className="flex flex-1 cursor-pointer flex-col gap-1 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                    Ảnh ngang tối thiểu 1200x600px
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Thư viện ảnh"
            description="Chọn những khoảnh khắc đẹp nhất để thể hiện phong cách biểu diễn của bạn."
            action={
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium">
                {uploadingGallery ? 'Đang tải...' : 'Thêm ảnh'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleAddGallery}
                  disabled={uploadingGallery}
                />
              </label>
            }
          >
            {gallery.length === 0 ? (
              <p className="text-muted-foreground">Chưa có ảnh portfolio.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {gallery.map((m) => (
                  <div key={m.id} className="group relative overflow-hidden rounded-xl border">
                    <Image
                      unoptimized
                      src={`${m.file_url}?v=${m.updated_at ?? ''}`}
                      alt={m.file_name}
                      width={300}
                      height={300}
                      className="h-44 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(m.id)}
                      disabled={deletingId === m.id}
                      className="absolute right-2 top-2 hidden rounded-full bg-background/80 p-2 text-destructive shadow transition group-hover:flex"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Video portfolio"
            description="Thêm video biểu diễn để nhà tổ chức nhanh chóng đánh giá phong cách của bạn."
            action={<Button onClick={() => setOpenAddVideo(true)}>Thêm video</Button>}
          >
            {videos.length === 0 ? (
              <p className="text-muted-foreground">Chưa có video nào.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <video
                        src={video.video_url}
                        controls
                        className="h-full w-full object-cover"
                        poster={video.thumbnail_url || undefined}
                      />
                    </div>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{video.title || 'Không tiêu đề'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(video.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setEditVideoData({ id: video.id, title: video.title })
                            setOpenEditVideo(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleVideoDeleted(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="experience" className="space-y-8">
          <SectionCard
            title="Kinh nghiệm & dịch vụ"
            description="Cập nhật những dự án nổi bật, kỹ năng và dịch vụ bạn cung cấp."
            action={
              <Button onClick={handleSaveExperience} disabled={savingExp}>
                <Save className="mr-2 h-4 w-4" />
                {savingExp
                  ? expForm.id
                    ? 'Đang cập nhật...'
                    : 'Đang lưu...'
                  : expForm.id
                    ? 'Cập nhật'
                    : 'Lưu mục mới'}
              </Button>
            }
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="exp_description">Kinh nghiệm</Label>
                <textarea
                  id="exp_description"
                  name="description"
                  rows={5}
                  value={expForm.description}
                  onChange={(e) => setExpForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả dự án, vai trò, thành tích..."
                  className="w-full rounded-md border bg-background p-3"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="exp_title">Chuyên môn</Label>
                  <Input
                    id="exp_title"
                    name="title"
                    value={expForm.title}
                    onChange={(e) => setExpForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Live Performance, Studio Recording..."
                  />
                </div>
                <div>
                  <Label htmlFor="exp_portfolio_url">Liên kết portfolio</Label>
                  <Input
                    id="exp_portfolio_url"
                    name="portfolio_url"
                    value={expForm.portfolio_url}
                    onChange={(e) =>
                      setExpForm((prev) => ({ ...prev, portfolio_url: e.target.value }))
                    }
                    placeholder="Spotify, YouTube, Facebook..."
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách kinh nghiệm</CardTitle>
              <CardDescription>Những mục này sẽ hiển thị trên hồ sơ công khai.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {experiences.length === 0 ? (
                <p className="text-muted-foreground">Chưa có mục nào.</p>
              ) : (
                experiences.map((experience) => (
                  <div
                    key={experience.id}
                    className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="pr-3">
                      <p className="font-medium">{experience.title || 'Chưa đặt tiêu đề'}</p>
                      {experience.description ? (
                        <p className="text-sm text-muted-foreground">{experience.description}</p>
                      ) : null}
                      {experience.portfolio_url ? (
                        <a
                          href={experience.portfolio_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary underline"
                        >
                          {experience.portfolio_url}
                        </a>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEditExperience(experience)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteExperience(experience.id)}
                        disabled={deletingExpId === experience.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-8">
          <SectionCard
            title="Liên hệ"
            description="Thông tin này giúp nhà tổ chức dễ dàng kết nối với bạn."
            action={
              <Button onClick={handleSaveContact} disabled={savingContact}>
                <Save className="mr-2 h-4 w-4" />
                {savingContact ? 'Đang lưu...' : 'Lưu liên hệ'}
              </Button>
            }
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formContact.email}
                  onChange={onContactChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Số điện thoại *</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formContact.phone_number}
                  onChange={onContactChange}
                  required
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Mạng xã hội"
            description="Gắn các kênh chính để fan và đối tác theo dõi bạn."
            action={
              <Button onClick={handleSaveSocial} disabled={savingSocial}>
                <Save className="mr-2 h-4 w-4" />
                {savingSocial ? 'Đang lưu...' : 'Lưu liên kết'}
              </Button>
            }
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="youtube_url">YouTube</Label>
                <Input
                  id="youtube_url"
                  name="youtube_url"
                  placeholder="https://youtube.com/..."
                  value={formSocial.youtube_url}
                  onChange={onSocialChange}
                />
              </div>
              <div>
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  placeholder="https://instagram.com/..."
                  value={formSocial.instagram_url}
                  onChange={onSocialChange}
                />
              </div>
              <div>
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  placeholder="https://facebook.com/..."
                  value={formSocial.facebook_url}
                  onChange={onSocialChange}
                />
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <VideoModal open={openAddVideo} setOpen={setOpenAddVideo} onUploaded={refreshVideos} />
      <VideoModal
        open={openEditVideo}
        setOpen={setOpenEditVideo}
        onUploaded={refreshVideos}
        init={editVideoData || undefined}
      />
    </main>
  )
}
