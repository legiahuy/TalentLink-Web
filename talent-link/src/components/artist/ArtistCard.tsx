import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star } from 'lucide-react'

interface ArtistCardProps {
  id: string
  name: string
  image: string | StaticImageData
  genre: string
  location: string
  rating?: number
  description?: string
}

const ArtistCard = ({ id, name, image, genre, location, rating, description }: ArtistCardProps) => {
  return (
    <Link href={`/artist/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-card border border-border/40 transition-all duration-300 hover:shadow-glow hover:border-primary/50 mx-3">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-card">
              {genre}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ArtistCard
