'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import { Camera, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function EditArtistProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [userType, setUserType] = useState<'artist' | 'producer'>('artist')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [gallery, setGallery] = useState<Array<{ id: string; file_url: string }>>([])
  const [savingAll, setSavingAll] = useState(false)
  const [savingType, setSavingType] = useState(false)
  const [savingImages, setSavingImages] = useState(false)

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    location: '',
    genres: '',
    email: '',
    phone: '',
    experience: '',
    specialties: '',
    portfolio: '',
  })

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const id = `${Date.now()}`
    setGallery((prev) => [{ id, file_url: url }, ...prev])
    e.target.value = ''
  }

  const handleDeleteMedia = (id: string) => {
    setGallery((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      toast.error('Bạn cần đăng nhập để lưu thay đổi')
      return
    }
    try {
      setSavingAll(true)
      const updatedUser = await userService.updateById(user.id, { display_name: formData.display_name } as any)
      toast.success('Đã cập nhật tên')
      // Nếu tên thay đổi thành công, cập nhật lại tên trong state hoặc điều hướng lại trang
      setFormData((prev) => ({ ...prev, display_name: updatedUser.display_name }))
   //   router.push('/profile/artist-profile')  // Điều hướng sang trang hồ sơ
    } catch (err: any) {
      console.error(err)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Cập nhật thất bại'
      toast.error(`Cập nhật thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setSavingAll(false)
    }
  }
  

  const handleSaveType = () => {
    setSavingType(true)
    setTimeout(() => {
      setSavingType(false)
      toast.success('Đã lưu loại hồ sơ (UI demo) – backend chưa kết nối')
    }, 400)
  }

  const handleSaveImages = async () => {
    if (!user?.id) {
      toast.error('Bạn cần đăng nhập để lưu thay đổi')
      return
    }
    try {
      setSavingImages(true)
      if (avatarFile) await userService.uploadAvatar(avatarFile)
      if (coverFile) await userService.uploadCover(coverFile)
      toast.success('Đã lưu ảnh')
      setAvatarFile(null)
      setCoverFile(null)
      setAvatarPreviewUrl(null)
      setCoverPreviewUrl(null)
      // điều hướng sang trang hồ sơ để nạp avatar/cover mới
      router.push('/profile/artist-profile')
    } catch (e: any) {
      console.error(e)
      const status = e?.response?.status
      const message = e?.response?.data?.message || e?.message || 'Lưu ảnh thất bại'
      toast.error(`Lưu ảnh thất bại${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setSavingImages(false)
    }
  }

  return (
    <main className="container mx-auto px-4 pt-28 pb-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ nghệ sĩ</h1>
        <p className="text-muted-foreground">Cập nhật thông tin của bạn để thu hút khách hàng</p>
      </div>

      {/* Loại hồ sơ + nút hành động */}
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
              <input
                type="radio"
                name="userType"
                value="artist"
                checked={userType === 'artist'}
                onChange={() => setUserType('artist')}
              />
              <span>Ca sĩ / Nghệ sĩ</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="producer"
                checked={userType === 'producer'}
                onChange={() => setUserType('producer')}
              />
              <span>Producer / Nhạc sĩ</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Ảnh đại diện, Ảnh bìa, Thư viện ảnh */}
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
                <Input type="file" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarFile(e.target.files?.[0] ?? null)} />
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
                <Input type="file" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCoverFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-base font-semibold mb-4">Thư viện ảnh</div>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {gallery.map((m) => (
                <div key={m.id} className="relative w-28 h-28 shrink-0">
                  <Image src={m.file_url} alt="media" width={112} height={112} className="w-28 h-28 rounded-xl object-cover" />
                  <button type="button" onClick={() => handleDeleteMedia(m.id)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white text-xs">×</button>
                </div>
              ))}
              <label className="w-12 h-12 rounded-full border flex items-center justify-center text-2xl cursor-pointer">
                +
                <input type="file" accept="image/*" className="hidden" onChange={handleAddGallery} />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin cơ bản</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" type="button">Hủy</Button>
              <Button type="submit" disabled={savingAll}><Save className="w-4 h-4 mr-2" />{savingAll ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="display_name">Tên nghệ danh *</Label>
              <Input id="display_name" name="display_name" value={formData.display_name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="bio">Giới thiệu *</Label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} placeholder="Viết vài dòng giới thiệu về bản thân và phong cách âm nhạc..." className="w-full min-h-24 border rounded-md p-3 bg-background" />
            </div>
            <div>
              <Label htmlFor="location">Địa điểm *</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Thành phố, Quốc gia" />
            </div>
            <div>
              <Label htmlFor="genres">Thể loại *</Label>
              <Input id="genres" name="genres" value={formData.genres} onChange={handleInputChange} placeholder="Jazz, Blues, Rock..." />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin liên hệ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin liên hệ</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" type="button">Hủy</Button>
              <Button type="submit"><Save className="w-4 h-4 mr-2" />Lưu thay đổi</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" required />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+84 XXX XXX XXX" />
            </div>
          </CardContent>
        </Card>

        {/* Thông tin nghề nghiệp */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin nghề nghiệp</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" type="button">Hủy</Button>
              <Button type="submit"><Save className="w-4 h-4 mr-2" />Lưu thay đổi</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="experience">Kinh nghiệm</Label>
              <textarea id="experience" name="experience" value={formData.experience} onChange={handleInputChange} rows={4} placeholder="Mô tả kinh nghiệm làm việc của bạn..." className="w-full min-h-24 border rounded-md p-3 bg-background" />
            </div>
            <div>
              <Label htmlFor="specialties">Chuyên môn</Label>
              <Input id="specialties" name="specialties" value={formData.specialties} onChange={handleInputChange} placeholder="Live Performance, Studio Recording, ..." />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio / Links</Label>
              <textarea id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleInputChange} rows={3} placeholder="Spotify, Youtube, Facebook, ..." className="w-full min-h-20 border rounded-md p-3 bg-background" />
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}
