import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    time: string
    status: 'upcoming' | 'ongoing' | 'past'
    artists: string[]
    image: string | StaticImageData
  }
}

const EventCard = ({
  event,
  glassy,
  animated,
}: EventCardProps & { glassy?: boolean; animated?: boolean }) => {
  const statusConfig = {
    upcoming: { label: 'Upcoming', color: 'bg-primary text-white' },
    ongoing: { label: 'Ongoing', color: 'bg-popover text-black' },
    past: { label: 'Past', color: 'bg-foreground text-white' },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <Link href={`/event/${event.id}`}>
      <Card
        className={`overflow-hidden hover:shadow-elegant transition-all duration-300 group cursor-pointer ${glassy ? 'bg-card/80 shadow-lg backdrop-blur border-primary/40' : ''} ${animated ? 'animate-in fade-in zoom-in duration-500' : ''} group-hover:scale-105 group-hover:shadow-glow group-hover:border-primary/60`}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className={statusConfig[event.status].color}>
              {statusConfig[event.status].label}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-3 line-clamp-2">{event.title}</h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {event.artists.map((artist, index) => (
                  <span key={index} className="text-primary">
                    {artist}
                    {index < event.artists.length - 1 && ','}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default EventCard
