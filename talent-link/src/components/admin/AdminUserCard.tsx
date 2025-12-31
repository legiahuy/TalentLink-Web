'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, MapPin, CheckCircle2 } from 'lucide-react'
import type { FeaturedUser } from '@/types/admin'

interface AdminUserCardProps {
  user: FeaturedUser
  onFeatureToggle: (userId: string, isFeatured: boolean) => void
  isLoading?: boolean
}

export function AdminUserCard({ user, onFeatureToggle, isLoading }: AdminUserCardProps) {
  return (
    <Card className="group relative border-border/50 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 h-[360px] flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Featured Badge */}
        {/* {user.is_featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 shadow-sm">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )} */}

        {/* User Avatar & Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0 ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.display_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {user.display_name}
              </h3>
              {/* {user.is_verified && (
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              )} */}
            </div>
            <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-3">
          <Badge variant="outline" className="capitalize border-primary/30 text-primary">
            {user.role}
          </Badge>
        </div>

        {/* Bio */}
        {user.brief_bio && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {user.brief_bio}
          </p>
        )}

        {/* Genres */}
        {user.genres && user.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {user.genres.slice(0, 3).map((genre) => (
              <Badge key={genre.id} variant="secondary" className="text-xs">
                {genre.name}
              </Badge>
            ))}
            {user.genres.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{user.genres.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Location */}
        {(user.city || user.country) && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="w-3 h-3" />
            <span className="truncate">
              {[user.city, user.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        {/* Action Button */}
        <Button
          onClick={() => onFeatureToggle(user.id, user.is_featured)}
          disabled={isLoading}
          variant={user.is_featured ? 'outline' : 'default'}
          className="w-full group-hover:shadow-md transition-all"
          size="sm"
        >
          {isLoading ? 'Processing...' : user.is_featured ? 'Unfeature' : 'Feature'}
        </Button>
      </CardContent>
    </Card>
  )
}
