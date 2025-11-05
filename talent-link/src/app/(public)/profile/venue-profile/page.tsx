'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import EventCard from '@/components/event/EventCard'
import { MapPin, Phone, Mail, Globe, Calendar } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab' // Adjusted import path for Tabs

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

const VenueProfile = () => {
  const params = useParams<{ id: string }>()
  const venueId = params?.id ?? ''

  // Mock data - will be replaced with API call
  const venue: Venue = {
    id: venueId,
    name: 'Acoustic Cafe & Bar',
    coverImage: '/images/auth/auth-photo-1.jpg', // Replace with actual cover image URL
    avatar: '/images/auth/auth-photo-1.jpg', // Replace with actual avatar URL
    type: 'Cafe & Bar',
    description:
      'Không gian nhạc acoustic ấm cúng, nơi hội tụ những tâm hồn yêu âm nhạc. Chúng tôi tổ chức đêm nhạc live mỗi thứ 6, thứ 7 và chủ nhật.',
    location: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '028 1234 5678',
    email: 'booking@acousticcafe.vn',
    website: 'www.acousticcafe.vn',
    capacity: '50-80 người',
    amenities: [
      'Hệ thống âm thanh chuyên nghiệp',
      'Ánh sáng sân khấu',
      'Phòng chờ cho nghệ sĩ',
      'Đồ ăn & đồ uống',
    ],
  }

  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Đêm Nhạc Acoustic - Những Bản Tình Ca',
      date: '2025-10-15',
      time: '19:30',
      status: 'upcoming',
      artists: ['Minh Tâm', 'Thu Hà'],
      image: '/images/auth/auth-photo-1.jpg', // Replace with actual event image
    },
    {
      id: '2',
      title: 'Live Session - Indie Night',
      date: '2025-10-20',
      time: '20:00',
      status: 'upcoming',
      artists: ['The Vibe Band', 'Acoustic Soul'],
      image: '/images/auth/auth-photo-1.jpg', // Replace with actual event image
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
      image: '/images/auth/auth-photo-1.jpg', // Replace with actual event image
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
      image: '/images/auth/auth-photo-1.jpg', // Replace with actual event image
    },
    {
      id: '5',
      title: 'Open Mic Night',
      date: '2025-09-25',
      time: '19:30',
      status: 'past',
      artists: ['Various Artists'],
      image: '/images/auth/auth-photo-1.jpg', // Replace with actual event image
    },
  ]

  return (
    <main className="flex-1">
      {/* Cover Image */}
      <div className="relative h-80 w-full">
        <Image
          src={venue.coverImage}
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
                src={venue.avatar}
                alt={venue.name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-lg object-cover border-4 border-background shadow-lg"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 bg-primary bg-clip-text text-transparent">
                      {venue.name}
                    </h1>
                    <p className="text-muted-foreground text-lg">{venue.type}</p>
                  </div>
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
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-5 h-5" />
                    <a
                      href={`https://${venue.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {venue.website}
                    </a>
                  </div>
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

          {/* Events Section */}
          <div className="mb-12">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 gap-8">
                <TabsTrigger value="upcoming" className="text-center py-2">
                  Sắp Diễn Ra
                </TabsTrigger>
                <TabsTrigger value="ongoing" className="text-center py-2">
                  Đang Diễn Ra
                </TabsTrigger>
                <TabsTrigger value="past" className="text-center py-2">
                  Đã Diễn Ra
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Events */}
              <TabsContent value="upcoming" className="space-y-6">
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12">
                    Chưa có sự kiện sắp diễn ra
                  </p>
                )}
              </TabsContent>

              {/* Ongoing Events */}
              <TabsContent value="ongoing" className="space-y-6">
                {ongoingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ongoingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12">
                    Không có sự kiện đang diễn ra
                  </p>
                )}
              </TabsContent>

              {/* Past Events */}
              <TabsContent value="past" className="space-y-6">
                {pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12">
                    Chưa có sự kiện nào được tổ chức
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

export default VenueProfile
