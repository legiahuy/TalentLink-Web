'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { userService } from '@/services/userService'
import { Camera, Save, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Media } from '@/types/media'
import type { User } from '@/types/user'
import type { Experience } from '@/types/experience'
import { X } from 'lucide-react'

export default function EditArtistProfilePage() {
  const [userType, setUserType] = useState<'artist' | 'producer'>('artist')

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

  const [gallery, setGallery] = useState<Media[]>([])
  const [savingAll, setSavingAll] = useState(false)
  const [savingType, setSavingType] = useState(false)
  const [savingImages, setSavingImages] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [savingContact, setSavingContact] = useState(false)

  // BASIC
  const [formBasic, setFormBasic] = useState({
    display_name: '',
    brief_bio: '',
    detail_bio: '',
    city: '',
    country: '',
  })
  // CONTACT
  const [formContact, setFormContact] = useState({
    email: '',
    phone_number: '',
  })
  // SOCIAL
  const [formSocial, setFormSocial] = useState({
    youtube_url: '',
    instagram_url: '',
    facebook_url: '',
  })

  // Experiences
  const [me, setMe] = useState<User | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [savingExp, setSavingExp] = useState(false)
  const [deletingExpId, setDeletingExpId] = useState<string | null>(null)
  const [expForm, setExpForm] = useState<{ id?: string; title: string; description: string; portfolio_url: string }>({
    title: '',
    description: '',
    portfolio_url: '',
  })

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [meRes, mediaRes] = await Promise.all([
          userService.getMe().catch(() => null),
          userService.getMyMedia(false).catch(() => ({ media: [], total: 0 })),
        ])
        if (meRes) {
          setMe(meRes)
          const u = meRes as any
          setFormBasic({
            display_name: u.display_name ?? '',
            brief_bio: u.brief_bio ?? '',
            detail_bio: u.detail_bio ?? '',
            city: u.city ?? '',
            country: u.country ?? '',
          })
          setFormContact({
            email: u.email ?? '',
            phone_number: u.phone_number ?? '',
          })
          setFormSocial({
            youtube_url: u.youtube_url ?? '',
            instagram_url: u.instagram_url ?? '',
            facebook_url: u.facebook_url ?? '',
          })
          try {
            const exps = await userService.listUserExperiences(u.id)
            setExperiences(exps || [])
          } catch { setExperiences([]) }
        }
        setGallery(mediaRes.media || [])
      } catch (e) {
        console.error(e)
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
    } catch (err: any) {
      console.error(err)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Tải ảnh thất bại'
      toast.error(`Tải ảnh thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  const handleDeleteMedia = async (id: string) => {
    if (!id) return
    if (!window.confirm('Xoá ảnh này khỏi thư viện?')) return
    const prev = gallery
    setDeletingId(id)
    setGallery((g) => g.filter((m) => m.id !== id))
    try {
      await userService.deleteMedia(id)
      toast.success('Đã xoá ảnh')
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'media:delete' } }))
    } catch (e: any) {
      console.error(e)
      setGallery(prev)
      const status = e?.response?.status
      const message = e?.response?.data?.message || e?.message || 'Xoá ảnh thất bại'
      toast.error(`Xoá ảnh thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSavingAll(true)
      const updated = await userService.updateBasic({
        display_name: formBasic.display_name?.trim() || undefined,
        brief_bio: formBasic.brief_bio?.trim() || undefined,
        detail_bio: formBasic.detail_bio?.trim() || undefined,
        city: formBasic.city?.trim() || undefined,
        country: formBasic.country?.trim() || undefined,
      })
      toast.success('Đã cập nhật thông tin cơ bản')
      setFormBasic({
        display_name: updated.display_name ?? formBasic.display_name,
        brief_bio: (updated as any)?.brief_bio ?? formBasic.brief_bio,
        detail_bio: (updated as any)?.detail_bio ?? formBasic.detail_bio,
        city: (updated as any)?.city ?? formBasic.city,
        country: (updated as any)?.country ?? formBasic.country,
      })
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'basic' } }))
    } catch (err: any) {
      console.error(err)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Cập nhật thất bại'
      toast.error(`Cập nhật thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setSavingAll(false)
    }
  }

  const handleSaveContact = async () => {
    try {
      setSavingContact(true)
      const updated = await userService.updateContact({
        email: formContact.email?.trim() || undefined,
        phone_number: formContact.phone_number?.trim() || undefined,
      })
      toast.success('Đã cập nhật thông tin liên hệ')
      setFormContact({
        email: updated.email ?? formContact.email,
        phone_number: (updated as any)?.phone_number ?? formContact.phone_number,
      })
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'contact' } }))
    } catch (err: any) {
      console.error(err)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Cập nhật liên hệ thất bại'
      toast.error(`Cập nhật liên hệ thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setSavingContact(false)
    }
  }

  const handleSaveSocial = async () => {
    try {
      const updated = await userService.updateSocial({
        youtube_url: formSocial.youtube_url?.trim() || undefined,
        instagram_url: formSocial.instagram_url?.trim() || undefined,
        facebook_url: formSocial.facebook_url?.trim() || undefined,
      })
      toast.success('Đã cập nhật liên kết mạng xã hội')
      setFormSocial({
        youtube_url: (updated as any)?.youtube_url ?? formSocial.youtube_url,
        instagram_url: (updated as any)?.instagram_url ?? formSocial.instagram_url,
        facebook_url: (updated as any)?.facebook_url ?? formSocial.facebook_url,
      })
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'social' } }))
    } catch (err: any) {
      console.error(err)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Cập nhật mạng xã hội thất bại'
      toast.error(`Cập nhật mạng xã hội thất bại${status ? ` (${status})` : ''}: ${message}`)
    }
  }

  const handleSaveType = () => {
    setSavingType(true)
    setTimeout(() => {
      setSavingType(false)
      toast.success('Đã lưu loại hồ sơ (UI demo)')
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'type' } }))
    }, 400)
  }

  const handleSaveImages = async () => {
    try {
      setSavingImages(true)
      let changed = false
      if (avatarFile) { await userService.uploadAvatar(avatarFile); changed = true }
      if (coverFile)  { await userService.uploadCover(coverFile);  changed = true }
      if (changed) {
        toast.success('Đã lưu ảnh đại diện & bìa')
        setAvatarFile(null); setCoverFile(null); setAvatarPreviewUrl(null); setCoverPreviewUrl(null)
        window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'avatar:cover' } }))
      } else {
        toast.message('Không có thay đổi ảnh')
      }
    } catch (e: any) {
      console.error(e)
      const status = e?.response?.status
      const message = e?.response?.data?.message || e?.message || 'Lưu ảnh thất bại'
      toast.error(`Lưu ảnh thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setSavingImages(false)
    }
  }

  // ===== Experience =====
  const onExpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setExpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const handleEditExperience = (exp: Experience) => {
    setExpForm({ id: exp.id, title: exp.title || '', description: exp.description || '', portfolio_url: exp.portfolio_url || '' })
    setTimeout(() => document.getElementById('exp_description')?.focus(), 0)
  }
  const resetExpForm = () => setExpForm({ id: undefined, title: '', description: '', portfolio_url: '' })
  const handleSaveExperience = async () => {
    if (!me?.id) { toast.error('Bạn cần đăng nhập'); return }
    if (!expForm.description.trim() && !expForm.title.trim()) { toast.error('Nhập ít nhất mô tả hoặc chuyên môn'); return }
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
      resetExpForm()
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'experience' } }))
    } catch (err: any) {
      console.error(err)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Lưu kinh nghiệm thất bại'
      toast.error(`Lưu kinh nghiệm thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally { setSavingExp(false) }
  }
  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm('Xoá mục kinh nghiệm này?')) return
    try {
      setDeletingExpId(id)
      await userService.deleteExperience(id)
      setExperiences((prev) => prev.filter((e) => e.id !== id))
      toast.success('Đã xoá kinh nghiệm')
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'experience:delete' } }))
      if (expForm.id === id) resetExpForm()
    } catch (err: any) {
      console.error(err)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Xoá kinh nghiệm thất bại'
      toast.error(`Xoá kinh nghiệm thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally { setDeletingExpId(null) }
  }

  return (
    <main className="container mx-auto px-4 pt-28 pb-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ nghệ sĩ</h1>
        <p className="text-muted-foreground">Cập nhật thông tin của bạn để thu hút khách hàng</p>
      </div>

      {/* Loại hồ sơ */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loại hồ sơ</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline" type="button">Hủy</Button>
            <Button type="button" onClick={handleSaveType} disabled={savingType}>
              <Save className="w-4 h-4 mr-2" />{savingType ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="userType" value="artist" checked={userType === 'artist'} onChange={() => setUserType('artist')} />
              <span>Ca sĩ / Nghệ sĩ</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="userType" value="producer" checked={userType === 'producer'} onChange={() => setUserType('producer')} />
              <span>Producer / Nhạc sĩ</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Ảnh */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ảnh</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline" type="button">Hủy</Button>
            <Button type="button" onClick={handleSaveImages} disabled={savingImages}>
              <Save className="w-4 h-4 mr-2" />{savingImages ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {avatarPreviewUrl ? (
                  <Image src={avatarPreviewUrl} alt="avatar" width={96} height={96} className="w-24 h-24 object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Ảnh đại diện</div>
                <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {coverPreviewUrl ? (
                  <Image src={coverPreviewUrl} alt="cover" width={96} height={96} className="w-24 h-24 object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Ảnh bìa</div>
                <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-semibold">Thư viện ảnh</div>
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer">
                <span>{uploadingGallery ? 'Đang tải...' : 'Thêm ảnh'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleAddGallery}
                  disabled={uploadingGallery}
                />
              </label>
            </div>

            {gallery.length === 0 ? (
              <p className="text-muted-foreground">Chưa có ảnh portfolio.</p>
            ) : (
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {gallery.map((m) => (
                  <div
                    key={m.id}
                    className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden group"
                    title={m.file_name}
                  >
                    <Image
                      src={m.file_url}
                      alt={m.file_name}
                      width={112}
                      height={112}
                      className="w-28 h-28 object-cover"
                    />
                    <button
                    type="button"
                    onClick={() => handleDeleteMedia(m.id)}
                    disabled={deletingId === m.id}
                    aria-label={deletingId === m.id ? 'Đang xoá...' : 'Xoá ảnh này'}
                    className="absolute top-1 right-1 z-10 w-8 h-8 rounded-full bg-destructive text-destructive-foreground
                              shadow-sm ring-1 ring-black/10 disabled:opacity-60 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* BASIC */}
      <form onSubmit={handleSaveBasic} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin cơ bản</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" type="button">Hủy</Button>
              <Button type="submit" disabled={savingAll}>
                <Save className="w-4 h-4 mr-2" />{savingAll ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="display_name">Tên nghệ danh *</Label>
              <Input id="display_name" name="display_name" value={formBasic.display_name} onChange={onBasicChange} required />
            </div>
            <div>
              <Label htmlFor="brief_bio">Giới thiệu ngắn *</Label>
              <textarea id="brief_bio" name="brief_bio" value={formBasic.brief_bio} onChange={onBasicChange} rows={3} className="w-full min-h-20 border rounded-md p-3 bg-background" />
            </div>
            <div>
              <Label htmlFor="detail_bio">Giới thiệu chi tiết</Label>
              <textarea id="detail_bio" name="detail_bio" value={formBasic.detail_bio} onChange={onBasicChange} rows={5} className="w-full min-h-28 border rounded-md p-3 bg-background" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="city">Thành phố *</Label><Input id="city" name="city" value={formBasic.city} onChange={onBasicChange} /></div>
              <div><Label htmlFor="country">Quốc gia *</Label><Input id="country" name="country" value={formBasic.country} onChange={onBasicChange} /></div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* EXPERIENCE */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thông tin nghề nghiệp</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline" type="button" onClick={() => setExpForm({ id: undefined, title: '', description: '', portfolio_url: '' })}>Hủy</Button>
            <Button type="button" onClick={handleSaveExperience} disabled={savingExp}>
              <Save className="w-4 h-4 mr-2" />{savingExp ? 'Đang lưu...' : (expForm.id ? 'Cập nhật' : 'Lưu thay đổi')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="exp_description">Kinh nghiệm</Label>
            <textarea id="exp_description" name="description" value={expForm.description} onChange={onExpChange} rows={5} placeholder="Mô tả kinh nghiệp làm việc của bạn" className="w-full min-h-28 border rounded-md p-3 bg-background"/>
          </div>
          <div>
            <Label htmlFor="exp_title">Chuyên môn</Label>
            <Input id="exp_title" name="title" value={expForm.title} onChange={onExpChange} placeholder="Live Performance, Studio Recording, ..." />
          </div>
          <div>
            <Label htmlFor="exp_portfolio_url">Portfolio/ Links</Label>
            <Input id="exp_portfolio_url" name="portfolio_url" value={expForm.portfolio_url} onChange={onExpChange} placeholder="Spotify, Youtube, Facebook, ..." />
          </div>

          <div className="pt-2">
            {experiences.length === 0 ? (
              <p className="text-muted-foreground">Chưa có mục kinh nghiệm nào.</p>
            ) : (
              <div className="space-y-3">
                {experiences.map((e) => (
                  <div key={e.id} className="flex items-start justify-between rounded-md border p-3">
                    <div className="pr-3">
                      <div className="font-medium">{e.title || 'Chưa đặt tiêu đề'}</div>
                      {e.description ? <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p> : null}
                      {e.portfolio_url ? <a href={e.portfolio_url} target="_blank" className="text-sm text-primary underline mt-1 inline-block" rel="noreferrer">{e.portfolio_url}</a> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" title="Sửa" onClick={() => handleEditExperience(e)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="destructive" title="Xoá" onClick={() => handleDeleteExperience(e.id)} disabled={deletingExpId === e.id}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CONTACT */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thông tin liên hệ</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline" type="button">Hủy</Button>
            <Button type="button" onClick={handleSaveContact} disabled={savingContact}>
              <Save className="w-4 h-4 mr-2" />{savingContact ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" value={formContact.email} onChange={onContactChange} placeholder="email@example.com" /></div>
          <div><Label htmlFor="phone_number">Số điện thoại *</Label><Input id="phone_number" name="phone_number" value={formContact.phone_number} onChange={onContactChange} placeholder="+84 XXX XXX XXX" /></div>
        </CardContent>
      </Card>

      {/* SOCIAL */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mạng xã hội</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline" type="button" onClick={() => setFormSocial({ youtube_url: '', instagram_url: '', facebook_url: '' })}>Hủy</Button>
            <Button type="button" onClick={handleSaveSocial}><Save className="w-4 h-4 mr-2" />Lưu thay đổi</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor="youtube_url">YouTube</Label><Input id="youtube_url" name="youtube_url" value={formSocial.youtube_url} onChange={onSocialChange} placeholder="https://youtube.com/..." /></div>
          <div><Label htmlFor="instagram_url">Instagram</Label><Input id="instagram_url" name="instagram_url" value={formSocial.instagram_url} onChange={onSocialChange} placeholder="https://instagram.com/..." /></div>
          <div><Label htmlFor="facebook_url">Facebook</Label><Input id="facebook_url" name="facebook_url" value={formSocial.facebook_url} onChange={onSocialChange} placeholder="https://facebook.com/..." /></div>
        </CardContent>
      </Card>
    </main>
  )
}
