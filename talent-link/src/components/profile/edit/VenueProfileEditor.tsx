'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Camera, Save, UploadCloud, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { venueService } from '@/services/venueService'
import { userService } from '@/services/userService'
import { UserRole } from '@/types/user'
import { MultiSelect } from '@/components/ui/multi-select'
import { resolveMediaUrl } from '@/lib/utils'

export const businessTypes = [
  { label: 'Tea Room (Phòng trà)', value: 'tea_room' },
  { label: 'Cafe (Quán cà phê)', value: 'cafe' },
  { label: 'Bar / Club', value: 'bar_club' },
  { label: 'Restaurant (Nhà hàng)', value: 'restaurant' },
  { label: 'Outdoor Stage (Sân khấu ngoài trời)', value: 'outdoor_stage' },
  { label: 'Theater (Nhà hát)', value: 'theater' },
  { label: 'Event Center (Trung tâm sự kiện)', value: 'event_center' },
]

export type BusinessType = (typeof businessTypes)[number]['value']

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'photos', label: 'Photos' },
  { id: 'contact', label: 'Contact & Address' },
  { id: 'details', label: 'Venue Details' },
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

export default function VenueProfileEditor() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [cacheBust, setCacheBust] = useState<number>(Date.now())

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [gallery, setGallery] = useState<
    Array<{ id: string; file_url: string; file_name?: string; updated_at?: string }>
  >([])
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null)

  const [savingBasic, setSavingBasic] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [savingAdditional, setSavingAdditional] = useState(false)
  const [savingImages, setSavingImages] = useState(false)

  // Initial values for change detection
  const [initialFormBasic, setInitialFormBasic] = useState({
    display_name: '',
    brief_bio: '',
    business_type: [] as string[],
    capacity: '',
  })

  const [initialFormContact, setInitialFormContact] = useState({
    city: '',
    country: '',
    detailed_address: '',
    email: '',
    phone_number: '',
    website_url: '',
  })

  const [initialFormAdditional, setInitialFormAdditional] = useState({
    convenient_facilities: '',
    open_hour: '',
    rent_price: '',
  })

  const [formBasic, setFormBasic] = useState({
    display_name: '',
    brief_bio: '',
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

  const venueName = formBasic.display_name || 'Venue'

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
        setLoading(true)
        const user = await userService.getMe()

        const basicData = {
          display_name: user.display_name || '',
          brief_bio: user.brief_bio || '',
          business_type: user.business_types || [],
          capacity: user.capacity || '',
        }

        const contactData = {
          city: user.city || '',
          country: user.country || '',
          detailed_address: user.detailed_address || '',
          email: user.email || '',
          phone_number: user.phone_number || '',
          website_url: user.website_url || '',
        }

        const additionalData = {
          convenient_facilities: (user.convenient_facilities || []).join(', '),
          open_hour: user.open_hour || '',
          rent_price: user.rent_price || '',
        }

        setInitialFormBasic(basicData)
        setInitialFormContact(contactData)
        setInitialFormAdditional(additionalData)

        setFormBasic(basicData)
        setFormContact(contactData)
        setFormAdditional(additionalData)

        const [mediaRes, avatarRes, coverRes] = await Promise.all([
          userService.getMyMedia(false).catch(() => ({ media: [], total: 0 })),
          userService.getMyAvatar().catch(() => null),
          userService.getMyCover().catch(() => null),
        ])

        // Filter to only show portfolio media (exclude avatar and cover)
        const allMedia = mediaRes.media || []
        setGallery(
          allMedia
            .filter((m) => m.media_type === 'portfolio')
            .map((m) => ({
              id: m.id,
              file_url: m.file_url,
              file_name: m.file_name,
              updated_at: m.updated_at,
            })),
        )
        setAvatarUrl(avatarRes?.file_url || user?.avatar_url || null)
        setCoverUrl(coverRes?.file_url || user?.cover_url || null)
        setCacheBust(Date.now())
      } catch (error) {
        console.error(error)
        toast.error('Unable to load profile data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
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
  const onAdditionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormAdditional((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  // Helper functions to check for changes
  const hasBasicChanges = useMemo(() => {
    return (
      formBasic.display_name.trim() !== initialFormBasic.display_name.trim() ||
      formBasic.brief_bio.trim() !== initialFormBasic.brief_bio.trim() ||
      JSON.stringify([...formBasic.business_type].sort()) !==
        JSON.stringify([...initialFormBasic.business_type].sort()) ||
      formBasic.capacity.trim() !== initialFormBasic.capacity.trim()
    )
  }, [formBasic, initialFormBasic])

  const hasContactChanges = useMemo(() => {
    return (
      formContact.city.trim() !== initialFormContact.city.trim() ||
      formContact.country.trim() !== initialFormContact.country.trim() ||
      formContact.detailed_address.trim() !== initialFormContact.detailed_address.trim() ||
      formContact.email.trim() !== initialFormContact.email.trim() ||
      formContact.phone_number.trim() !== initialFormContact.phone_number.trim() ||
      formContact.website_url.trim() !== initialFormContact.website_url.trim()
    )
  }, [formContact, initialFormContact])

  const hasAdditionalChanges = useMemo(() => {
    return (
      formAdditional.convenient_facilities.trim() !==
        initialFormAdditional.convenient_facilities.trim() ||
      formAdditional.open_hour.trim() !== initialFormAdditional.open_hour.trim() ||
      formAdditional.rent_price.trim() !== initialFormAdditional.rent_price.trim()
    )
  }, [formAdditional, initialFormAdditional])

  const handleSaveBasic = async () => {
    if (!hasBasicChanges) return

    try {
      setSavingBasic(true)
      await venueService.updateBasic({
        display_name: formBasic.display_name,
        brief_bio: formBasic.brief_bio,
        business_type: formBasic.business_type,
        capacity: formBasic.capacity,
      })
      toast.success('Basic information saved')
      setInitialFormBasic(formBasic)
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Save failed')
      toast.error(message)
    } finally {
      setSavingBasic(false)
    }
  }

  const handleSaveContact = async () => {
    if (!hasContactChanges) return

    try {
      setSavingContact(true)
      await venueService.updateContact(formContact)
      toast.success('Contact information saved')
      setInitialFormContact(formContact)
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Save failed')
      toast.error(message)
    } finally {
      setSavingContact(false)
    }
  }

  const handleSaveAdditional = async () => {
    if (!hasAdditionalChanges) return

    try {
      setSavingAdditional(true)
      await venueService.updateAdditional({
        convenient_facilities: formAdditional.convenient_facilities.split(',').map((s) => s.trim()),
        open_hour: formAdditional.open_hour,
        rent_price: formAdditional.rent_price,
      })
      toast.success('Venue details saved')
      setInitialFormAdditional(formAdditional)
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Save failed')
      toast.error(message)
    } finally {
      setSavingAdditional(false)
    }
  }

  const handleSaveImages = async () => {
    try {
      setSavingImages(true)
      let changed = false
      if (avatarFile) {
        await venueService.uploadAvatar(avatarFile)
        changed = true
      }
      if (coverFile) {
        await venueService.uploadCover(coverFile)
        changed = true
      }
      if (changed) {
        toast.success('Profile images updated')
        setAvatarFile(null)
        setCoverFile(null)
        setAvatarPreviewUrl(null)
        setCoverPreviewUrl(null)
        setCacheBust(Date.now())
        // Refresh avatar/cover URLs
        const [avatarRes, coverRes] = await Promise.all([
          userService.getMyAvatar().catch(() => null),
          userService.getMyCover().catch(() => null),
        ])
        setAvatarUrl(avatarRes?.file_url || null)
        setCoverUrl(coverRes?.file_url || null)
        window.dispatchEvent(
          new CustomEvent('profile:updated', { detail: { what: 'avatar:cover' } }),
        )
      } else {
        toast.message('No image changes')
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to save images')
      toast.error(message)
    } finally {
      setSavingImages(false)
    }
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
    }
  }

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
    }
  }

  const handleAddGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    try {
      setUploadingGallery(true)
      for (const file of files) {
        const media = await userService.uploadMedia(file)
        // Map Media to gallery format (same as ArtistProfileEditor)
        setGallery((prev) => [
          {
            id: media.id,
            file_url: media.file_url,
            file_name: media.file_name,
            updated_at: media.updated_at,
          },
          ...prev,
        ])
      }
      toast.success(`Uploaded ${files.length} image${files.length > 1 ? 's' : ''}`)
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'media:add' } }))
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to upload images')
      toast.error(message)
    } finally {
      setUploadingGallery(false)
      e.target.value = ''
    }
  }

  const handleDeleteMedia = async (id: string) => {
    setMediaToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteMedia = async () => {
    if (!mediaToDelete) return
    const id = mediaToDelete
    const prev = gallery
    setDeletingId(id)
    setGallery((g) => g.filter((m) => m.id !== id))
    setDeleteDialogOpen(false)
    setMediaToDelete(null)
    try {
      await userService.deleteMedia(id)
      toast.success('Image deleted')
      window.dispatchEvent(new CustomEvent('profile:updated', { detail: { what: 'media:delete' } }))
    } catch (error: unknown) {
      console.error(error)
      setGallery(prev)
      const message = getErrorMessage(error, 'Failed to delete image')
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen relative">
        {/* Hero Section - Static Content Always Visible */}
        <section className="relative border-b pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-linear-to-br from-primary/15 via-primary/8 to-primary/5">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-transparent animate-pulse" />

          {/* Animated grid pattern */}
          <div
            className="absolute inset-0 opacity-30 animate-[gridMove_8s_linear_infinite]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Animated floating orbs */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 right-20 w-52 h-52 bg-primary/25 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-10 left-1/3 w-44 h-44 bg-primary/20 rounded-full blur-3xl animate-float-slow" />

          {/* Glowing accent lines */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent animate-shimmer" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />

          <div className="relative mx-auto w-full max-w-[1320px] px-4 md:px-6 z-10">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground relative z-10">
                Settings
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight relative">
                <span className="relative z-10">Manage Your Venue Profile</span>
                <span className="absolute inset-0 bg-linear-to-r from-primary/40 via-primary/30 to-primary/20 blur-2xl animate-pulse opacity-60" />
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed relative z-10">
                Update information to make your venue appear more professional.
              </p>
            </div>
          </div>
        </section>

        {/* Full-width background wrapper */}
        <div className="w-full bg-linear-to-br from-muted/50 via-muted/30 to-muted/40 relative">
          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
          {/* Decorative blur orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-8 md:py-10 relative z-10">
            {/* Tabs - Static Content Always Visible */}
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="px-4 py-2 capitalize">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Dynamic Content Skeletons */}
              <div className="space-y-8">
                {/* Profile Card Skeleton */}
                <Card>
                  <Skeleton className="h-52 w-full rounded-t-xl" />
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <Skeleton className="h-32 w-32 rounded-2xl shrink-0" />
                      <div className="flex-1 space-y-3 w-full">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-14" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Section Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative border-b pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-linear-to-br from-primary/15 via-primary/8 to-primary/5">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-transparent animate-pulse" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-30 animate-[gridMove_8s_linear_infinite]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated floating orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-20 w-52 h-52 bg-primary/25 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-10 left-1/3 w-44 h-44 bg-primary/20 rounded-full blur-3xl animate-float-slow" />

        {/* Glowing accent lines */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1320px] px-4 md:px-6 z-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground relative z-10">
              Settings
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight relative">
              <span className="relative z-10">Manage Your Venue Profile</span>
              <span className="absolute inset-0 bg-linear-to-r from-primary/40 via-primary/30 to-primary/20 blur-2xl animate-pulse opacity-60" />
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed relative z-10">
              Update information to make your venue appear more professional.
            </p>
          </div>
        </div>
      </section>

      {/* Full-width background wrapper */}
      <div className="w-full bg-linear-to-br from-muted/50 via-muted/30 to-muted/40 relative">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        {/* Decorative blur orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 py-8 md:py-10 relative z-10">
          {/* Main Content */}
          <div className="space-y-8">
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
                              : '/images/profile/background-default.jpg'
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
                            <span>Change Cover Photo</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              className="hidden"
                              onChange={handleCoverFileChange}
                            />
                          </label>
                          {(avatarFile || coverFile) && (
                            <Button size="sm" onClick={handleSaveImages} disabled={savingImages}>
                              {savingImages ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Photos
                                </>
                              )}
                            </Button>
                          )}
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
                                  : '/images/profile/avatar-default.svg'
                            }
                            alt={venueName}
                            width={128}
                            height={128}
                            className="h-32 w-32 rounded-2xl border-4 border-background object-cover shadow-lg"
                          />
                          <label className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                            <Camera className="h-4 w-4" />
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              className="hidden"
                              onChange={handleAvatarFileChange}
                            />
                          </label>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Venue Profile
                            </p>
                            <h2 className="text-2xl font-semibold">{venueName}</h2>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formContact.city || formContact.country
                              ? `${formContact.city}, ${formContact.country}`
                              : 'Location not updated'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>

                <SectionCard
                  title="Basic Information"
                  description="Set venue name, type, and capacity."
                  action={
                    <Button onClick={handleSaveBasic} disabled={savingBasic || !hasBasicChanges}>
                      {savingBasic ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="display_name">Venue Name *</Label>
                      <Input
                        id="display_name"
                        name="display_name"
                        value={formBasic.display_name}
                        onChange={onBasicChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="brief_bio">Brief Description</Label>
                      <textarea
                        id="brief_bio"
                        name="brief_bio"
                        rows={3}
                        value={formBasic.brief_bio}
                        onChange={onBasicChange}
                        placeholder="Brief description about your venue"
                        className="w-full rounded-md border bg-background p-3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="business_type">Business Type</Label>
                      <MultiSelect
                        options={businessTypes}
                        selected={formBasic.business_type}
                        onChange={(selected) =>
                          setFormBasic((prev) => ({
                            ...prev,
                            business_type: selected,
                          }))
                        }
                        placeholder="Select business types..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        value={formBasic.capacity}
                        onChange={onBasicChange}
                        placeholder="e.g., 200 people"
                      />
                    </div>
                  </div>
                </SectionCard>
              </TabsContent>

              <TabsContent value="photos" className="space-y-8">
                <SectionCard
                  title="Profile Photos"
                  description="Profile picture and cover photo will appear on your public profile page."
                  action={
                    <Button
                      onClick={handleSaveImages}
                      disabled={savingImages || (!avatarFile && !coverFile)}
                    >
                      {savingImages ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Photos
                        </>
                      )}
                    </Button>
                  }
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label>Profile Picture</Label>
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
                          Avatar image file (max 5MB, JPEG/PNG/GIF/WebP)
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={handleAvatarFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Cover Photo</Label>
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
                          Cover image file (max 10MB, JPEG/PNG/GIF/WebP)
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={handleCoverFileChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="Photo Gallery"
                  description="Showcase your venue with high-quality photos."
                  action={
                    <>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleAddGallery}
                        disabled={uploadingGallery}
                        id="gallery-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingGallery}
                        onClick={() => document.getElementById('gallery-upload')?.click()}
                      >
                        {uploadingGallery ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Add Photos
                          </>
                        )}
                      </Button>
                    </>
                  }
                >
                  {gallery.length === 0 ? (
                    <p className="text-muted-foreground">No portfolio photos yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {gallery
                        .filter((m) => m?.file_url)
                        .map((m) => (
                          <div
                            key={m.id}
                            className="group relative overflow-hidden rounded-xl border"
                          >
                            <Image
                              unoptimized
                              src={`${resolveMediaUrl(m.file_url)}?v=${m.updated_at ?? ''}`}
                              alt={m.file_name || 'Gallery'}
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
              </TabsContent>

              <TabsContent value="contact" className="space-y-8">
                <SectionCard
                  title="Contact & Address"
                  description="Help artists and organizers easily reach out to you."
                  action={
                    <Button
                      onClick={handleSaveContact}
                      disabled={savingContact || !hasContactChanges}
                    >
                      {savingContact ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  }
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formContact.city}
                          onChange={onContactChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formContact.country}
                          onChange={onContactChange}
                          required
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
                        placeholder="Street address, building, floor"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
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
                        <Label htmlFor="phone_number">Phone Number *</Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          value={formContact.phone_number}
                          onChange={onContactChange}
                          required
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
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </SectionCard>
              </TabsContent>

              <TabsContent value="details" className="space-y-8">
                <SectionCard
                  title="Venue Details"
                  description="Provide information about amenities, hours, and pricing."
                  action={
                    <Button
                      onClick={handleSaveAdditional}
                      disabled={savingAdditional || !hasAdditionalChanges}
                    >
                      {savingAdditional ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="convenient_facilities">Amenities</Label>
                      <Input
                        id="convenient_facilities"
                        name="convenient_facilities"
                        value={formAdditional.convenient_facilities}
                        onChange={onAdditionalChange}
                        placeholder="e.g., Sound System, Stage Lighting, Parking"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separate amenities with commas
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="open_hour">Opening Hours</Label>
                      <textarea
                        id="open_hour"
                        name="open_hour"
                        rows={3}
                        value={formAdditional.open_hour}
                        onChange={onAdditionalChange}
                        placeholder="e.g., Mon-Fri: 6PM-2AM, Sat-Sun: 5PM-3AM"
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
                        placeholder="e.g., $500/night for weekdays, $800/night for weekends"
                        className="w-full rounded-md border bg-background p-3"
                      />
                    </div>
                  </div>
                </SectionCard>
              </TabsContent>
            </Tabs>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this image from your library? This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeleteMedia}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </main>
  )
}
