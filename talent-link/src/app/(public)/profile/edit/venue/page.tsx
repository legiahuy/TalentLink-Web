'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Camera, Save, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { venueService } from '@/services/venueService'
import { userService } from '@/services/userService'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/types/user'

export default function EditVenueProfilePage() {
  const router = useRouter()

  // ---------------- ROLE CHECK ----------------
  useEffect(() => {
    (async () => {
      const me = await userService.getMe()
      if (me.role !== UserRole.VENUE) {
        router.push('/not-authorized')
      }
    })()
  }, [])

  // ---------------- IMAGE STATES ----------------
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

  // Gallery
  const [gallery, setGallery] = useState<Array<{ id: string; file_url: string; file_name?: string }>>([])
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ---------------- FORM STATES ----------------
  const [savingBasic, setSavingBasic] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [savingAdditional, setSavingAdditional] = useState(false)
  const [savingImages, setSavingImages] = useState(false)

  const [formBasic, setFormBasic] = useState({
    display_name: '',
    business_type: [] as string[],
    capacity: '',
  })

  const [formContact, setFormContact] = useState({
    city: '',
    country: '',
    detailed_address: '',
    email: '',
    phone_number: '',
    website_url: '',
  })

  const [formAdditional, setFormAdditional] = useState({
    convenient_facilities: '',
    open_hour: '',
    rent_price: '',
  })

  // ---------------- LOAD INITIAL ----------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await userService.getMe()

        setFormBasic({
          display_name: user.display_name || '',
          business_type: (user as any)?.business_types || [],
          capacity: (user as any)?.capacity || '',
        })

        setFormContact({
          city: user.city || '',
          country: user.country || '',
          detailed_address: (user as any)?.detailed_address || '',
          email: user.email || '',
          phone_number: user.phone_number || '',
          website_url: (user as any)?.website_url || '',
        })

        setFormAdditional({
          convenient_facilities: ((user as any)?.convenient_facilities || []).join(', '),
          open_hour: (user as any)?.open_hour || '',
          rent_price: (user as any)?.rent_price || '',
        })

        const media = await venueService.getMedia()
       
      } catch (e) {
        console.error(e)
      }
    }
    loadData()
  }, [])

  // ---------------- PREVIEW IMAGE ----------------
  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile)
      setLogoPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [logoFile])

  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile)
      setCoverPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [coverFile])

  // ---------------- HANDLERS ----------------
  const onBasicChange = (e: any) => setFormBasic((p) => ({ ...p, [e.target.name]: e.target.value }))
  const onContactChange = (e: any) => setFormContact((p) => ({ ...p, [e.target.name]: e.target.value }))
  const onAdditionalChange = (e: any) => setFormAdditional((p) => ({ ...p, [e.target.name]: e.target.value }))

  // ---------------- SAVE BASIC ----------------
  const handleSaveBasic = async () => {
    try {
      setSavingBasic(true)
      await venueService.updateBasic({
        display_name: formBasic.display_name,
        business_type: formBasic.business_type,
        capacity: formBasic.capacity,
      })
      toast.success('Đã lưu thông tin cơ bản')
    } catch (e) {
      toast.error('Lưu thất bại')
    } finally {
      setSavingBasic(false)
    }
  }

  // ---------------- SAVE CONTACT ----------------
  const handleSaveContact = async () => {
    try {
      setSavingContact(true)
      await venueService.updateContact(formContact)
      toast.success('Đã lưu thông tin liên hệ')
    } catch (e) {
      toast.error('Lưu thất bại')
    } finally {
      setSavingContact(false)
    }
  }

  // ---------------- SAVE ADDITIONAL ----------------
  const handleSaveAdditional = async () => {
    try {
      setSavingAdditional(true)
      await venueService.updateAdditional({
        convenient_facilities: formAdditional.convenient_facilities.split(',').map((s) => s.trim()),
        open_hour: formAdditional.open_hour,
        rent_price: formAdditional.rent_price,
      })
      toast.success('Đã lưu thông tin hoạt động')
    } catch {
      toast.error('Lưu thất bại')
    } finally {
      setSavingAdditional(false)
    }
  }

  // ---------------- SAVE IMAGES ----------------
  const handleSaveImages = async () => {
    try {
      setSavingImages(true)
      let changed = false

      if (logoFile) {
        await venueService.uploadAvatar(logoFile)
        changed = true
      }

      if (coverFile) {
        await venueService.uploadCover(coverFile)
        changed = true
      }

      if (changed) toast.success('Đã lưu ảnh')
    } catch {
      toast.error('Lỗi khi tải ảnh')
    } finally {
      setSavingImages(false)
    }
  }

  // ---------------- GALLERY ----------------
  const handleAddGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
  
    try {
      setUploadingGallery(true)
  
      for (const file of files) {
        const media = await venueService.uploadMedia(file)
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
      await venueService.deleteMedia(id)
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
  
  // ----------------------------------------------------------
  // -------------------------- UI ----------------------------
  // ----------------------------------------------------------
  return (
    <main className="container mx-auto px-4 pt-28 pb-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Chỉnh sửa hồ sơ Cơ sở Kinh doanh</h1>

      {/* ======================== IMAGES ======================== */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ảnh</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline">Hủy</Button>
            <Button onClick={handleSaveImages} disabled={savingImages}>
              <Save className="w-4 h-4 mr-2" /> {savingImages ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Avatar + Cover — GIỐNG ARTIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                {logoPreviewUrl ? (
                  <Image src={logoPreviewUrl} alt="logo" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
            </div>

            {/* Cover */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                {coverPreviewUrl ? (
                  <Image src={coverPreviewUrl} alt="cover" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          {/* GALLERY — GIỐNG ARTIST */}
<div className="mt-8">
  <div className="flex items-center justify-between mb-3">
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
        >
          <Image
            src={m.file_url}
            alt={m.file_name || 'Gallery image'}
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

      {/* ======================== BASIC ======================== */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thông tin cơ bản</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline">Hủy</Button>
            <Button onClick={handleSaveBasic} disabled={savingBasic}>
              <Save className="w-4 h-4 mr-2" /> {savingBasic ? 'Đang lưu…' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Tên cơ sở *</Label>
            <Input name="display_name" value={formBasic.display_name} onChange={onBasicChange} />
          </div>

          <div>
            <Label>Loại hình</Label>
            <Input
              name="business_type"
              value={formBasic.business_type.join(', ')}
              onChange={(e) =>
                setFormBasic((prev) => ({
                  ...prev,
                  business_type: e.target.value.split(',').map((s) => s.trim()),
                }))
              }
            />
          </div>

          <div>
            <Label>Sức chứa</Label>
            <Input name="capacity" value={formBasic.capacity} onChange={onBasicChange} />
          </div>
        </CardContent>
      </Card>

      {/* ======================== CONTACT ======================== */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liên hệ & Địa chỉ</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline">Hủy</Button>
            <Button onClick={handleSaveContact} disabled={savingContact}>
              <Save className="w-4 h-4 mr-2" /> {savingContact ? 'Đang lưu…' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div><Label>Thành phố</Label><Input name="city" value={formContact.city} onChange={onContactChange} /></div>
          <div><Label>Quốc gia</Label><Input name="country" value={formContact.country} onChange={onContactChange} /></div>
          <div><Label>Địa chỉ chi tiết</Label><Input name="detailed_address" value={formContact.detailed_address} onChange={onContactChange} /></div>
          <div><Label>Email</Label><Input name="email" value={formContact.email} onChange={onContactChange} /></div>
          <div><Label>Số điện thoại</Label><Input name="phone_number" value={formContact.phone_number} onChange={onContactChange} /></div>
          <div><Label>Website</Label><Input name="website_url" value={formContact.website_url} onChange={onContactChange} /></div>
        </CardContent>
      </Card>

      {/* ======================== ADDITIONAL ======================== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thông tin hoạt động</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline">Hủy</Button>
            <Button onClick={handleSaveAdditional} disabled={savingAdditional}>
              <Save className="w-4 h-4 mr-2" /> {savingAdditional ? 'Đang lưu…' : 'Lưu thay đổi'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Tiện ích</Label>
            <Input name="convenient_facilities" value={formAdditional.convenient_facilities} onChange={onAdditionalChange} />
          </div>

          <div>
            <Label>Giờ mở cửa</Label>
            <textarea
              name="open_hour"
              rows={3}
              className="w-full p-3 border rounded-md bg-background"
              value={formAdditional.open_hour}
              onChange={onAdditionalChange}
            />
          </div>

          <div>
            <Label>Giá thuê</Label>
            <textarea
              name="rent_price"
              rows={3}
              className="w-full p-3 border rounded-md bg-background"
              value={formAdditional.rent_price}
              onChange={onAdditionalChange}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
