'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import EventCard from '@/components/event/EventCard'
import { MapPin, Phone, Mail, Globe, Calendar, Loader, Frown } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab'
import { resolveMediaUrl } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { userService } from '@/services/userService'

interface Venue {
  id: string
  name: string
  coverImage: string
  avatar: string
  type: string
  description: string
  location: string
  phone: string
  email: string
  website: string
  capacity: string
  amenities: string[]
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  status: 'upcoming' | 'ongoing' | 'past'
  artists: string[]
  image: string
}

const ProfilePage = () => {
  const params = useParams<{ username: string }>()
  const t = useTranslations('NotFound')
  const username = params?.username ?? ''
  const { user: currentUser } = useAuthStore()
  const router = useRouter()

  // State management
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [venue, setVenue] = useState<Venue | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [cacheBust, setCacheBust] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if this is the current user's profile
  const isOwnProfile = currentUser?.username === username

  /* ---------------------------------------------------
     🔥 TODO: Load venue profile từ API bằng username
     Replace this useEffect with your fetch logic
  ----------------------------------------------------*/
  useEffect(() => {
    if (!username) {
      setError('Username không hợp lệ')
      setLoading(false)
      return
    }

    const loadProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        // TODO: Replace with your API call to fetch user by username
        // Example: const userData = await userService.getUserByUsername(username)
        // Then map the data to the Venue interface

        // Placeholder - remove this when implementing
        // const userData = await fetchUserByUsername(username)
        // setVenue({ ... })
        // setAvatarUrl(...)
        // setCoverUrl(...)

        const userData = userService.getUser(currentUser?.id!)

        setCacheBust(Date.now())
      } catch (e) {
        console.error('Error loading venue profile:', e)
        const errorMessage = e instanceof Error ? e.message : 'Không tải được hồ sơ venue'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    )
  }

  // Error state
  if (error || !venue) {
    return (
      <div className="min-h-[70vh] w-full relative flex items-center justify-center">
        {/* Dual Gradient Overlay (Top) Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 0.3px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 0.3px, transparent 1px),
        radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
      `,
            backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
          }}
        />

        <div className="w-full max-w-lg p-6">
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <Frown className="z-10 size-10" />
            <h2 className="text-2xl font-bold z-10">Profile Not Found</h2>
            <p className="z-10">{t('description')}</p>
            <Button
              onClick={() => {
                router.replace('/')
              }}
              variant="link"
              size="lg"
              className="z-10 hover:cursor-pointer text-md"
            >
              {t('back')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------
     🔥 Mọi phần EVENT giữ nguyên — KHÔNG ĐỤNG
  ----------------------------------------------------*/
  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Đêm Nhạc Acoustic - Những Bản Tình Ca',
      date: '2025-10-15',
      time: '19:30',
      status: 'upcoming',
      artists: ['Minh Tâm', 'Thu Hà'],
      image: '/images/auth/auth-photo-1.jpg',
    },
    {
      id: '2',
      title: 'Live Session - Indie Night',
      date: '2025-10-20',
      time: '20:00',
      status: 'upcoming',
      artists: ['The Vibe Band', 'Acoustic Soul'],
      image: '/images/auth/auth-photo-1.jpg',
    },
  ]

  const ongoingEvents: Event[] = [
    {
      id: '3',
      title: 'Weekend Jazz Vibes',
      date: '2025-10-08',
      time: '20:00',
      status: 'ongoing',
      artists: ['Jazz Collective'],
      image: '/images/auth/auth-photo-1.jpg',
    },
  ]

  const pastEvents: Event[] = [
    {
      id: '4',
      title: 'Đêm Nhạc Trịnh - Tưởng Nhớ',
      date: '2025-09-30',
      time: '19:00',
      status: 'past',
      artists: ['Văn Anh', 'Hoàng Long'],
      image: '/images/auth/auth-photo-1.jpg',
    },
    {
      id: '5',
      title: 'Open Mic Night',
      date: '2025-09-25',
      time: '19:30',
      status: 'past',
      artists: ['Various Artists'],
      image: '/images/auth/auth-photo-1.jpg',
    },
  ]

  return (
    <main className="flex-1">
      {/* Cover Image */}
      <div className="relative h-80 w-full">
        <Image
          unoptimized
          src={coverUrl ? `${resolveMediaUrl(coverUrl)}?v=${cacheBust}` : venue.coverImage}
          alt={venue.name}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="px-6 md:px-8 -mt-20 relative z-10">
        <div className="mx-auto max-w-7xl">
          {/* Venue Info Card */}
          <div className="bg-card rounded-lg shadow-elegant p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <Image
                unoptimized
                src={avatarUrl ? `${resolveMediaUrl(avatarUrl)}?v=${cacheBust}` : venue.avatar}
                alt={venue.name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-lg object-cover border-4 border-background shadow-lg"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 bg-primary bg-clip-text text-transparent">
                      {venue.name}
                    </h1>
                    <p className="text-muted-foreground text-lg">{venue.type}</p>
                  </div>

                  {/* Only show edit button if this is the current user's profile */}
                  {isOwnProfile && (
                    <button
                      onClick={() => (window.location.href = '/profile/edit/venue')}
                      className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80 transition"
                    >
                      Thay đổi thông tin
                    </button>
                  )}
                </div>

                <p className="text-foreground/90 mb-6 leading-relaxed">{venue.description}</p>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-5 h-5" />
                    <span>{venue.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                    <span>{venue.email}</span>
                  </div>
                  {venue.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-5 h-5" />
                      <Link
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {venue.website}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Tiện Nghi & Dịch Vụ
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Sức chứa: {venue.capacity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Events Section (GIỮ NGUYÊN) */}
          <div className="mb-12">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 gap-8">
                <TabsTrigger value="upcoming">Sắp Diễn Ra</TabsTrigger>
                <TabsTrigger value="ongoing">Đang Diễn Ra</TabsTrigger>
                <TabsTrigger value="past">Đã Diễn Ra</TabsTrigger>
              </TabsList>

              {/* Upcoming */}
              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </TabsContent>

              {/* Ongoing */}
              <TabsContent value="ongoing">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ongoingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </TabsContent>

              {/* Past */}
              <TabsContent value="past">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
