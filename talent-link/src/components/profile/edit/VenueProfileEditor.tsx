'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Camera, Save, X } from 'lucide-react'
import { toast } from 'sonner'

import { venueService } from '@/services/venueService'
import { userService } from '@/services/userService'
import { UserRole } from '@/types/user'

export default function VenueProfileEditor() {
  const router = useRouter()

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [gallery, setGallery] = useState<
    Array<{ id: string; file_url: string; file_name?: string }>
  >([])
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  useEffect(() => {
    ;(async () => {
      const me = await userService.getMe()
      if (me.role !== UserRole.VENUE) {
        router.replace('/not-authorized')
      }
    })()
  }, [router])

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
        setGallery(media?.media || media || [])
      } catch (error) {
        console.error(error)
      }
    }
    loadData()
  }, [])

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

  const onBasicChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormBasic((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const onContactChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormContact((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const onAdditionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormAdditional((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSaveBasic = async () => {
    try {
      setSavingBasic(true)
      await venueService.updateBasic({
        display_name: formBasic.display_name,
        business_type: formBasic.business_type,
        capacity: formBasic.capacity,
      })
      toast.success('Basic information saved')
    } catch (error) {
      toast.error('Save failed')
    } finally {
      setSavingBasic(false)
    }
  }

  const handleSaveContact = async () => {
    try {
      setSavingContact(true)
      await venueService.updateContact(formContact)
      toast.success('Contact information saved')
    } catch (error) {
      toast.error('Save failed')
    } finally {
      setSavingContact(false)
    }
  }

  const handleSaveAdditional = async () => {
    try {
      setSavingAdditional(true)
      await venueService.updateAdditional({
        convenient_facilities: formAdditional.convenient_facilities.split(',').map((s) => s.trim()),
        open_hour: formAdditional.open_hour,
        rent_price: formAdditional.rent_price,
      })
      toast.success('Activity information saved')
    } catch (error) {
      toast.error('Save failed')
    } finally {
      setSavingAdditional(false)
    }
  }

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
      if (changed) toast.success('Images saved')
      else toast.message('No changes')
    } catch (error) {
      toast.error('Error uploading images')
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
        const media = await venueService.uploadMedia(file)
        setGallery((prev) => [media, ...prev])
      }
      toast.success(`Uploaded ${files.length} images`)
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'media:add' } }))
    } catch (err: any) {
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Failed to upload images'
      toast.error(`Failed to upload images${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Delete this image from library?')) return
    const prev = gallery
    setDeletingId(id)
    setGallery((g) => g.filter((m) => m.id !== id))
    try {
      await venueService.deleteMedia(id)
      toast.success('Image deleted')
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'media:delete' } }))
    } catch (err: any) {
      console.error(err)
      setGallery(prev)
      const status = err?.response?.status
      const message = err?.response?.data?.message || err?.message || 'Failed to delete image'
      toast.error(`Failed to delete image${status ? ` (${status})` : ''}: ${message}`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 pt-24 pb-10">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Settings</p>
        <h1 className="text-3xl font-bold">Edit Venue Profile</h1>
        <p className="text-muted-foreground">
          Update information to make your venue appear more professional.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Photos</CardTitle>
          <Button onClick={handleSaveImages} disabled={savingImages}>
            <Save className="mr-2 h-4 w-4" /> {savingImages ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted">
                {logoPreviewUrl ? (
                  <Image
                    src={logoPreviewUrl}
                    alt="logo"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted">
                {coverPreviewUrl ? (
                  <Image
                    src={coverPreviewUrl}
                    alt="cover"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-base font-semibold">Photo Gallery</div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2">
                <span>{uploadingGallery ? 'Uploading...' : 'Add Photos'}</span>
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
              <p className="text-muted-foreground">No portfolio photos yet.</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {gallery.map((m) => (
                  <div
                    key={m.id}
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border"
                  >
                    <Image
                      src={m.file_url}
                      alt={m.file_name || 'Gallery'}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(m.id)}
                      disabled={deletingId === m.id}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-destructive shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          <Button onClick={handleSaveBasic} disabled={savingBasic}>
            <Save className="mr-2 h-4 w-4" /> {savingBasic ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="display_name">Venue Name *</Label>
            <Input
              id="display_name"
              name="display_name"
              value={formBasic.display_name}
              onChange={onBasicChange}
            />
          </div>
          <div>
            <Label htmlFor="business_type">Business Type</Label>
            <Input
              id="business_type"
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
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              value={formBasic.capacity}
              onChange={onBasicChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact & Address</CardTitle>
          <Button onClick={handleSaveContact} disabled={savingContact}>
            <Save className="mr-2 h-4 w-4" /> {savingContact ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={formContact.city} onChange={onContactChange} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formContact.country}
                onChange={onContactChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="detailed_address">Detailed Address</Label>
            <Input
              id="detailed_address"
              name="detailed_address"
              value={formContact.detailed_address}
              onChange={onContactChange}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formContact.email} onChange={onContactChange} />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formContact.phone_number}
                onChange={onContactChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="website_url">Website</Label>
            <Input
              id="website_url"
              name="website_url"
              value={formContact.website_url}
              onChange={onContactChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Activity Information</CardTitle>
          <Button onClick={handleSaveAdditional} disabled={savingAdditional}>
            <Save className="mr-2 h-4 w-4" /> {savingAdditional ? 'Saving…' : 'Save Changes'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="convenient_facilities">Amenities</Label>
            <Input
              id="convenient_facilities"
              name="convenient_facilities"
              value={formAdditional.convenient_facilities}
              onChange={onAdditionalChange}
            />
          </div>
          <div>
            <Label htmlFor="open_hour">Opening Hours</Label>
            <textarea
              id="open_hour"
              name="open_hour"
              rows={3}
              value={formAdditional.open_hour}
              onChange={onAdditionalChange}
              className="w-full rounded-md border bg-background p-3"
            />
          </div>
          <div>
            <Label htmlFor="rent_price">Rental Price</Label>
            <textarea
              id="rent_price"
              name="rent_price"
              rows={3}
              value={formAdditional.rent_price}
              onChange={onAdditionalChange}
              className="w-full rounded-md border bg-background p-3"
            />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
