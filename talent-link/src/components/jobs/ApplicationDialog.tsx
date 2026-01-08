'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, X, Loader2 } from 'lucide-react'
import { jobService } from '@/services/jobService'
import { analytics } from '@/lib/analytics'

interface ApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobId: string
  jobTitle: string
  companyName: string
}

const ApplicationDialog = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  companyName,
}: ApplicationDialogProps) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([''])
  const [attachments, setAttachments] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      // Validate file size (10MB max)
      const validFiles = newFiles.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 10MB.`)
          return false
        }
        return true
      })
      setAttachments([...attachments, ...validFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const addPortfolioLink = () => {
    if (portfolioLinks.length < 10) {
      setPortfolioLinks([...portfolioLinks, ''])
    }
  }

  const removePortfolioLink = (index: number) => {
    setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index))
  }

  const updatePortfolioLink = (index: number, value: string) => {
    const newLinks = [...portfolioLinks]
    newLinks[index] = value
    setPortfolioLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (attachments.length === 0) {
      toast.error('Please attach at least one demo file (audio, video, or document).')
      return
    }

    setSubmitting(true)

    try {
      // Upload all attachments first
      const uploadedUrls: string[] = []
      for (const file of attachments) {
        try {
          const response = await jobService.uploadSubmissionMedia(file)
          console.log('res', response)
          uploadedUrls.push(response.media?.file_url)
        } catch (error) {
          console.error('Failed to upload file:', file.name, error)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      if (uploadedUrls.length === 0) {
        toast.error('Failed to upload attachments. Please try again.')
        setSubmitting(false)
        return
      }

      console.log('uploadedUrls: ', uploadedUrls)

      // Use the first uploaded file as demo_file (required)
      const demoFile = uploadedUrls[0]
      console.log('demoFile: ', demoFile)

      // Filter out empty portfolio links
      const validPortfolioLinks = portfolioLinks.filter((link) => link.trim() !== '')

      // Submit application
      await jobService.submitApplication(jobId, {
        demo_file: demoFile,
        full_name: fullName,
        email: email,
        phone_number: phone,
        cover_letter: message,
        portfolio_links: validPortfolioLinks.length > 0 ? validPortfolioLinks : undefined,
      })

      // Track job application event
      analytics.logApplyJob(jobId, jobTitle).catch(console.error)

      toast.success('Application submitted successfully!', {
        description: 'Your application has been sent to the employer.',
      })

      // Reset form
      setFullName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setPortfolioLinks([''])
      setAttachments([])
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit application', error)
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      toast.error(errorMessage || 'Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Apply for Job</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {jobTitle} at {companyName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Full Name */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="fullName" className="block text-sm">
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="email" className="block text-sm">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="phone" className="block text-sm">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="flex flex-col gap-3">
            <Label className="block text-sm">
              Portfolio/Video Links (YouTube, SoundCloud, etc.)
            </Label>
            <div className="space-y-2">
              {portfolioLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => updatePortfolioLink(index, e.target.value)}
                  />
                  {portfolioLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePortfolioLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {portfolioLinks.length < 10 && (
                <Button type="button" variant="outline" size="sm" onClick={addPortfolioLink}>
                  Add Another Link
                </Button>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="message" className="block text-sm">
              About Yourself *
            </Label>
            <Textarea
              id="message"
              placeholder="Share your experience, skills, and why you're a good fit for this position..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="attachments" className="block text-sm">
              Attach Demo Files (Required) *
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  id="attachments"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.mp3,.mp4,.wav,.flac,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('attachments')?.click()}
                  className="w-full"
                  disabled={submitting}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm truncate block">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeAttachment(index)}
                        disabled={submitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload audio demos, video performances, CV, or portfolio. At least one file is
              required. (Max 10MB per file)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-primary hover:bg-primary/90"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationDialog
