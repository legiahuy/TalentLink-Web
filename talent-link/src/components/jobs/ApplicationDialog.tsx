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
import { Upload, X } from 'lucide-react'

interface ApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobTitle: string
  companyName: string
}

const ApplicationDialog = ({
  open,
  onOpenChange,
  jobTitle,
  companyName,
}: ApplicationDialogProps) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [portfolioLink, setPortfolioLink] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast.success('Application submitted successfully!', {
      description: 'Your application has been sent to the employer.',
    })

    // Reset form
    setFullName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setPortfolioLink('')
    setAttachments([])
    onOpenChange(false)
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

          {/* Portfolio Link */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="portfolio" className="block text-sm">
              Portfolio/Video Link (YouTube, SoundCloud, etc.)
            </Label>
            <Input
              id="portfolio"
              type="url"
              placeholder="https://..."
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
            />
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
              Attach Documents (CV, demo, etc.)
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  id="attachments"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('attachments')?.click()}
                  className="w-full"
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
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported: PDF, DOC, MP3, MP4, JPG, PNG (Max 10MB per file)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:flex-1 bg-primary hover:bg-primary/90">
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationDialog
