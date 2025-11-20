'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import EventCard from '@/components/event/EventCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab'
import { MapPin, Phone, Mail, Globe, Calendar } from 'lucide-react'
import type { User } from '@/types/user'
import { resolveMediaUrl } from '@/lib/utils'

interface VenueProfileViewProps {
  profile: User
  avatarUrl?: string | null
  coverUrl?: string | null
  isOwner: boolean
  onEdit?: () => void
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

const sampleEvents: Record<'upcoming' | 'ongoing' | 'past', Event[]> = {
  upcoming: [
    {
      id: '1',
      title: 'Acoustic Night - Love Songs',
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
  ],
  ongoing: [
    {
      id: '3',
      title: 'Weekend Jazz Vibes',
      date: '2025-10-08',
      time: '20:00',
      status: 'ongoing',
      artists: ['Jazz Collective'],
      image: '/images/auth/auth-photo-1.jpg',
    },
  ],
  past: [
    {
      id: '4',
      title: 'Trinh Music Night - In Memory',
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
  ],
}

export function VenueProfileView({
  profile,
  avatarUrl,
  coverUrl,
  isOwner,
  onEdit,
}: VenueProfileViewProps) {
  const venueName = profile.display_name || profile.username
  const location = [profile.city, profile.country].filter(Boolean).join(', ')
  const phone = profile.phone_number || ''
  const email = profile.email || ''
  const website = (profile as any).website_url || ''
  const description =
    (profile as any).open_hour || (profile as any).detail_bio || 'No activity description'
  const capacity = (profile as any).capacity || ''
  const amenities = ((profile as any).convenient_facilities as string[]) || []
  const type = Array.isArray((profile as any).business_types)
    ? (profile as any).business_types.join(', ')
    : (profile as any).business_type || ''

  const formatWebsiteUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `https://${url}`
  }

  return (
    <main className="flex-1">
      <div className="relative h-80 w-full">
        <Image
          unoptimized
          src={
            coverUrl
              ? `${resolveMediaUrl(coverUrl)}?v=${profile.updated_at ?? ''}`
              : '/images/auth/auth-photo-1.jpg'
          }
          alt={venueName}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="px-6 md:px-8 -mt-20 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="bg-card rounded-lg shadow-elegant p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Image
                unoptimized
                src={
                  avatarUrl
                    ? `${resolveMediaUrl(avatarUrl)}?v=${profile.updated_at ?? ''}`
                    : '/images/auth/auth-photo-1.jpg'
                }
                alt={venueName}
                width={128}
                height={128}
                className="w-32 h-32 rounded-lg object-cover border-4 border-background shadow-lg"
              />

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 bg-primary bg-clip-text text-transparent">
                      {venueName}
                    </h1>
                    <p className="text-muted-foreground text-lg">{type || 'Performance Venue'}</p>
                  </div>

                  {isOwner ? (
                    <Button onClick={onEdit} className="px-4 py-2">
                      Update Information
                    </Button>
                  ) : null}
                </div>

                <p className="text-foreground/90 mb-6 leading-relaxed">{description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {location ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span>{location}</span>
                    </div>
                  ) : null}
                  {phone ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-5 h-5" />
                      <span>{phone}</span>
                    </div>
                  ) : null}
                  {email ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-5 h-5" />
                      <span>{email}</span>
                    </div>
                  ) : null}
                  {website ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-5 h-5" />
                      <a
                        href={formatWebsiteUrl(website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {website}
                      </a>
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Amenities & Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.length ? (
                      amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Amenities not updated</span>
                    )}
                  </div>
                  {capacity ? (
                    <p className="text-sm text-muted-foreground mt-3">Capacity: {capacity}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 gap-8">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleEvents.upcoming.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ongoing">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleEvents.ongoing.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleEvents.past.map((event) => (
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

export default VenueProfileView
