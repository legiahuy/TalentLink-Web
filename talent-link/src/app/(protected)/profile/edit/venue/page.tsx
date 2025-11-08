'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Camera, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function EditVenueProfilePage() {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [gallery, setGallery] = useState<Array<{ id: string; file_url: string }>>([])
  const [savingAll, setSavingAll] = useState(false)
  const [savingImages, setSavingImages] = useState(false)

  const [formData, setFormData] = useState({
    venue_name: '',
    description: '',
    location: '',
    capacity: '',
    amenities: '',
    email: '',
    phone: '',
    website: '',
  })

  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile)
      setLogoPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setLogoPreviewUrl(null)
  }, [logoFile])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSavingAll(true)
    setTimeout(() => {
      setSavingAll(false)
      toast.success('Đã lưu (UI demo) – backend chưa kết nối')
    }, 500)
  }

  const handleSaveImages = () => {
    setSavingImages(true)
    setTimeout(() => {
      setSavingImages(false)
      toast.success('Đã lưu ảnh (UI demo) – backend chưa kết nối')
    }, 400)
  }

  return (
    <main className="container mx-auto px-4 pt-28 pb-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chỉnh sửa hồ sơ cơ sở kinh doanh</h1>
        <p className="text-muted-foreground">Cập nhật thông tin cơ sở kinh doanh của bạn để thu hút nghệ sĩ</p>
      </div>

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
              <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                {logoPreviewUrl ? (
                  <Image src={logoPreviewUrl} alt="logo" width={96} height={96} className="w-24 h-24 object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Ảnh đại diện</div>
                <Input type="file" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chỉnh sửa thông tin cơ bản</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" type="button">Hủy</Button>
              <Button type="submit" disabled={savingAll}><Save className="w-4 h-4 mr-2" />{savingAll ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="venue_name">Tên cơ sở kinh doanh*</Label>
              <Input id="venue_name" name="venue_name" value={formData.venue_name} onChange={handleInputChange} placeholder="Nhập tên cơ sở kinh doanh" required />
            </div>
            <div>
              <Label htmlFor="amenities">Loại hình*</Label>
              <Input id="amenities" name="amenities" value={formData.amenities} onChange={handleInputChange} placeholder="Phòng trà, Quán bar, Nhà hàng, Câu lạc lạc bộ,..." />
            </div>
            <div>
              <Label htmlFor="description">Mô tả*</Label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Giới thiệu về cơ sở kinh doanh của bạn, phong cách, đặc điểm nổi bật,..." className="w-full min-h-24 border rounded-md p-3 bg-background" />
            </div>
            <div>
              <Label htmlFor="capacity">Sức chứa*</Label>
              <Input id="capacity" name="capacity" value={formData.capacity} onChange={handleInputChange} placeholder="Số lượng khán giả tối đa" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Địa chỉ & liên hệ</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" type="button">Hủy</Button>
              <Button type="submit"><Save className="w-4 h-4 mr-2" />Lưu thay đổi</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Thành phố*</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Hà Nội, Hồ Chí Minh,..." />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ chi tiết*</Label>
              <Input id="address" name="address" value={(formData as any).address || ''} onChange={handleInputChange} placeholder="Số nhà, tên đường, quận/huyện" />
            </div>
            <div>
              <Label htmlFor="email">Email*</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại*</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+84 XXX XXX XXX" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin hoạt động</CardTitle>
            <div className="flex gap-3">
              <Button variant="outline" type="button">Hủy</Button>
              <Button type="submit"><Save className="w-4 h-4 mr-2" />Lưu thay đổi</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="opening">Thời gian mở cửa</Label>
              <textarea id="opening" name="opening" value={(formData as any).opening || ''} onChange={handleInputChange} rows={3} placeholder="Thứ 2 - Thứ 6: 18:30 - 23:30\nThứ 7 - Chủ nhật: 14:00 - 00:00" className="w-full min-h-20 border rounded-md p-3 bg-background" />
            </div>
            <div>
              <Label htmlFor="amenities_detail">Tiện ích</Label>
              <textarea id="amenities_detail" name="amenities_detail" value={(formData as any).amenities_detail || ''} onChange={handleInputChange} rows={3} placeholder="Hệ thống âm thanh chuyên nghiệp, Sân khấu, Bãi đậu xe, Wifi miễn phí,..." className="w-full min-h-20 border rounded-md p-3 bg-background" />
            </div>
            <div>
              <Label htmlFor="pricing">Giá thuê / Điều kiện</Label>
              <textarea id="pricing" name="pricing" value={(formData as any).pricing || ''} onChange={handleInputChange} rows={3} placeholder="Thông tin về giá thuê và điều kiện hợp tác" className="w-full min-h-20 border rounded-md p-3 bg-background" />
            </div>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}
