'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Phone, Mail, Globe, Building2, Users, MessageCircle } from 'lucide-react'
import type { User } from '@/types/user'
import { resolveMediaUrl } from '@/lib/utils'

interface VenueProfileViewProps {
  profile: User
  avatarUrl?: string | null
  coverUrl?: string | null
  isOwner: boolean
  onEdit?: () => void
  loadingProfile?: boolean
  loadingGallery?: boolean
}


const businessTypes: Array<{ label: string; value: string }> = [
  { label: 'Tea Room (Phòng trà)', value: 'tea_room' },
  { label: 'Cafe (Quán cà phê)', value: 'cafe' },
  { label: 'Bar / Club', value: 'bar_club' },
  { label: 'Restaurant (Nhà hàng)', value: 'restaurant' },
  { label: 'Outdoor Stage (Sân khấu ngoài trời)', value: 'outdoor_stage' },
  { label: 'Theater (Nhà hát)', value: 'theater' },
  { label: 'Event Center (Trung tâm sự kiện)', value: 'event_center' },
]

export function VenueProfileView({
  profile,
  avatarUrl,
  coverUrl,
  isOwner,
  onEdit,
  loadingProfile = false,
  loadingGallery = false,
}: VenueProfileViewProps) {
  const venueName = profile.display_name || profile.username
  const location = [profile.city, profile.country].filter(Boolean).join(', ')
  const phone = profile.phone_number || ''
  const email = profile.email || ''
  const website = profile.website_url || ''
  const description = profile.open_hour || profile.detail_bio || 'No description available yet.'
  const capacity = profile.capacity || ''
  const amenities = profile.convenient_facilities || []

  // Map business types to their labels
  const businessTypeValues = Array.isArray(profile.business_types)
    ? profile.business_types
    : profile.business_types
      ? [profile.business_types]
      : []

  const businessTypeLabels = businessTypeValues
    .map((value: string) => businessTypes.find((bt) => bt.value === value)?.label)
    .filter(Boolean) as string[]

  const formatWebsiteUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `https://${url}`
  }

  return (
    <main className="flex-1">
      <div className="h-80 md:h-100 bg-gradient-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: `url(${
              coverUrl
                ? `${resolveMediaUrl(coverUrl)}?v=${profile.updated_at ?? ''}`
                : '/images/profile/background-default.jpg'
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="px-6 md:px-8 -mt-20 relative z-10">
        <div className="mx-auto max-w-[1320px]">
          <Card className="mb-8 bg-card border-border/40 shadow-lg">
            <CardContent className="p-8">
              {loadingProfile ? (
                <div className="flex flex-col md:flex-row gap-8">
                  <Skeleton className="w-32 h-32 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-8">
                  <Image
                    unoptimized
                    src={
                      avatarUrl
                        ? `${resolveMediaUrl(avatarUrl)}?v=${profile.updated_at ?? ''}`
                        : '/images/profile/avatar-default.svg'
                    }
                    alt={venueName}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-background shadow-lg shrink-0"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-4xl font-bold mb-2">{venueName}</h1>
                        {businessTypeLabels.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {businessTypeLabels.map((label) => (
                              <Badge
                                key={label}
                                variant="secondary"
                                className="text-sm px-2 py-0.5"
                              >
                                {label}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-lg">Performance Venue</p>
                        )}
                      </div>

                      {isOwner ? (
                        <Button onClick={onEdit} size="lg">
                          Update Information
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Button size="lg" variant="default" asChild>
                            <Link href="/booking">Contact Venue</Link>
                          </Button>
                          <Button size="lg" variant="outline" asChild>
                            <Link
                              href={`/messages?userId=${profile.id}`}
                              className="flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="h-5 w-5" />
                              Message
                            </Link>
                          </Button>
                        </div>
                      )}
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
                          <a href={`tel:${phone}`} className="hover:text-primary transition-colors">
                            {phone}
                          </a>
                        </div>
                      ) : null}
                      {email ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-5 h-5" />
                          <a
                            href={`mailto:${email}`}
                            className="hover:text-primary transition-colors"
                          >
                            {email}
                          </a>
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
                      {capacity ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-5 h-5" />
                          <span>Capacity: {capacity}</span>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Amenities & Services
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {amenities.length ? (
                          amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary">
                              {amenity}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">Amenities not updated</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* <div className="mb-12">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
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
          </div> */}
        </div>
      </div>
    </main>
  )
}

export default VenueProfileView
