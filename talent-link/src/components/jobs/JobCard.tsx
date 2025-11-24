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
import type { Job } from '@/types/job'

interface JobCardProps {
  job: Job
  onApply?: (jobId: string) => void
  onViewDetails?: (jobId: string) => void
  onToggleSave?: (jobId: string, isSaved: boolean) => void
  isSaved?: boolean
}

const JobCard = ({ job, onApply, onViewDetails, onToggleSave, isSaved = false }: JobCardProps) => {
  const [saved, setSaved] = useState(isSaved)

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

  const handleSave = () => {
    const newSavedState = !saved
    setSaved(newSavedState)
    onToggleSave?.(job.id, newSavedState)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-14 h-14 rounded-lg border-2 border-border">
            <AvatarImage src={job.companyLogo} alt={job.company} />
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
              {job.company
                .split(' ')
                .map((word) => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {job.title}
                </h3>
                <CardDescription className="font-medium text-base">{job.company}</CardDescription>
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
            <span className="truncate">{job.type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{getTimeAgo(job.postedDate)}</span>
          </div>
        </div>

        <Separator />

        {/* Genres */}
        <div className="flex flex-wrap gap-2">
          {job.genres.map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">{job.description}</p>

        {/* Requirements Preview */}
        {job.requirements.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Requirements
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              {job.requirements.slice(0, 2).map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">•</span>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
              {job.requirements.length > 2 && (
                <li className="text-xs text-muted-foreground italic">
                  +{job.requirements.length - 2} more requirement
                  {job.requirements.length - 2 !== 1 ? 's' : ''}
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
