'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Star, MapPin, Calendar, DollarSign, Eye, FileText } from 'lucide-react'
import type { FeaturedJob } from '@/types/admin'

interface AdminJobCardProps {
  job: FeaturedJob
  onFeatureToggle: (jobId: string, isFeatured: boolean) => void
  isLoading?: boolean
}

const formatCurrency = (amount: number, currency: string) => {
  if (currency === 'VND') {
    return `${(amount / 1000000).toFixed(1)}M VND`
  }
  return `${amount} ${currency}`
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateString
  }
}

export function AdminJobCard({ job, onFeatureToggle, isLoading }: AdminJobCardProps) {
  return (
    <Card className="group relative border-border/50 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 h-[480px] flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Featured Badge */}
        {/* {job.is_featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 shadow-sm">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )} */}

        {/* Job Title & Type */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize border-primary/30 text-primary">
              {job.post_type.replace('_', ' ')}
            </Badge>
            {job.type && (
              <Badge variant="secondary" className="capitalize">
                {job.type}
              </Badge>
            )}
            <Badge
              variant={job.status === 'published' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {job.status}
            </Badge>
          </div>
        </div>

        {/* Brief Description */}
        {job.brief_description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {job.brief_description}
          </p>
        )}

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span className="text-muted-foreground">By:</span>
          <span className="font-medium truncate">
            {job.creator_name || job.creator_username || 'Unknown'}
          </span>
        </div>

        {/* Budget */}
        {(job.budget_min || job.budget_max) && job.budget_currency && (
          <div className="flex items-center gap-2 text-sm mb-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {job.budget_min && job.budget_max
                ? `${formatCurrency(job.budget_min, job.budget_currency)} - ${formatCurrency(job.budget_max, job.budget_currency)}`
                : job.budget_min
                  ? `From ${formatCurrency(job.budget_min, job.budget_currency)}`
                  : `Up to ${formatCurrency(job.budget_max!, job.budget_currency)}`}
            </span>
          </div>
        )}

        {/* Location */}
        {job.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{job.location}</span>
            {job.location_type && (
              <Badge variant="outline" className="text-xs capitalize">
                {job.location_type}
              </Badge>
            )}
          </div>
        )}

        {/* Deadline */}
        {job.deadline && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        )}

        {/* Genres */}
        {job.genres && job.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.genres.slice(0, 3).map((genre, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
            {job.genres.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{job.genres.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 p-2 rounded-lg bg-muted/30">
          {job.total_submissions !== undefined && (
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>{job.total_submissions} submissions</span>
            </div>
          )}
          {job.views_count !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{job.views_count} views</span>
            </div>
          )}
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        {/* Action Button */}
        <Button
          onClick={() => onFeatureToggle(job.id, job.is_featured)}
          disabled={isLoading}
          variant={job.is_featured ? 'outline' : 'default'}
          className="w-full group-hover:shadow-md transition-all"
          size="sm"
        >
          {isLoading ? 'Processing...' : job.is_featured ? 'Unfeature' : 'Feature'}
        </Button>
      </CardContent>
    </Card>
  )
}
