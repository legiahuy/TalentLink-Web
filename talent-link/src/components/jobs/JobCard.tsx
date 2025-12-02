import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resolveMediaUrl } from '@/lib/utils'
import type { JobPost } from '@/types/job'

interface JobCardProps {
  job: JobPost
  onApply?: (jobId: string) => void
  onViewDetails?: (jobId: string) => void
  onToggleSave?: (jobId: string, isSaved: boolean) => void
  isSaved?: boolean
}

const JobCard = ({ job, onApply, onViewDetails, onToggleSave, isSaved = false }: JobCardProps) => {
  const [saved, setSaved] = useState(isSaved)
  const router = useRouter()

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30)
      return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) !== 1 ? 's' : ''} ago`
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) !== 1 ? 's' : ''} ago`
  }

  const formatSalary = () => {
    if (!job.budget_min && !job.budget_max) return 'Negotiable'
    
    const currency = job.budget_currency || 'USD'
    const currencySymbol = currency === 'VND' ? '₫' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '¥'
    const period = job.payment_type ? `/${job.payment_type.replace('by', '').toLowerCase()}` : ''
    
    if (job.budget_min && job.budget_max) {
      return `${currencySymbol}${job.budget_min}-${job.budget_max}${period}`
    } else if (job.budget_min) {
      return `${currencySymbol}${job.budget_min}+ ${period}`
    } else if (job.budget_max) {
      return `Up to ${currencySymbol}${job.budget_max}${period}`
    }
    return 'Negotiable'
  }

  const getJobType = () => {
    // Return the 'type' field (band, musician, dj, producer)
    if (job.type) {
      return job.type.charAt(0).toUpperCase() + job.type.slice(1)
    }
    // Fallback to post_type
    return job.post_type === 'job_offer' ? 'Job' : job.post_type === 'gig' ? 'Gig' : 'Availability'
  }

  const getLocation = () => {
    if (job.location) {
      return job.location_type ? `${job.location} (${job.location_type})` : job.location
    }
    return job.location_type || 'Remote'
  }

  const handleSave = () => {
    const newSavedState = !saved
    setSaved(newSavedState)
    onToggleSave?.(job.id, newSavedState)
  }

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (job.creator_username) {
      router.push(`/profile/${job.creator_username}`)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <button onClick={handleCreatorClick} className="shrink-0 cursor-pointer">
            <Avatar className="w-14 h-14 rounded-lg border-2 border-border hover:border-primary transition-colors">
              <AvatarImage src={resolveMediaUrl(job.creator_avatar)} alt={job.creator_name || 'Unknown'} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                {(job.creator_name || 'Unknown')
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {job.title}
                </h3>
                <button 
                  onClick={handleCreatorClick}
                  className="text-left hover:underline"
                >
                  <CardDescription className="font-medium text-base">
                    {job.creator_name || 'Unknown'}
                  </CardDescription>
                </button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={handleSave}
                aria-label={saved ? 'Remove from saved' : 'Save job'}
              >
                {saved ? (
                  <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Meta Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="truncate">{getJobType()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{getLocation()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 shrink-0" />
            <span className="truncate">{formatSalary()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{getTimeAgo(job.created_at)}</span>
          </div>
        </div>

        <Separator />

        {/* Genres */}
        {job.genres && job.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.genres.map((genre, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
          {job.brief_description || job.description}
        </p>

        {/* Required Skills Preview */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Required Skills
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              {job.required_skills.slice(0, 2).map((skill, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span className="leading-relaxed">{skill}</span>
                </li>
              ))}
              {job.required_skills.length > 2 && (
                <li className="text-xs text-muted-foreground italic">
                  +{job.required_skills.length - 2} more skill
                  {job.required_skills.length - 2 !== 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 gap-2">
        <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => onApply?.(job.id)}>
          Apply Now
        </Button>
        <Button variant="outline" className="shrink-0" onClick={() => onViewDetails?.(job.id)}>
          <ExternalLink className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

export default JobCard
