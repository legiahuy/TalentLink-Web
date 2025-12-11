'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UploadCloud, Image as ImageIcon, Loader2, X } from 'lucide-react'
import { videoService } from '@/services/videoService'
import { toast } from 'sonner'

export default function VideoModal({
  open,
  setOpen,
  onUploaded,
  init,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  onUploaded: () => void
  init?: { id: string; title: string }
}) {
  const [title, setTitle] = useState(init?.title || '')
  const [file, setFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)

      if (init) {
        await videoService.updateVideo(init.id, {
          file,
          thumbnail,
          title,
        })
        toast.success('Video updated successfully!')
      } else {
        if (!file) {
          toast.error('Please select a video file!')
          return
        }
        await videoService.uploadVideo({ file, thumbnail, title })
        toast.success('Video uploaded successfully!')
      }

      setOpen(false)
      onUploaded()
      // Reset form
      setTitle(init?.title || '')
      setFile(null)
      setThumbnail(null)
    } catch (e) {
      console.error(e)
      toast.error('Failed to save video')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    // Reset form when closing
    if (!saving) {
      setTitle(init?.title || '')
      setFile(null)
      setThumbnail(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{init ? 'Edit Video' : 'Add Video'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title</Label>
            <Input
              id="video-title"
              placeholder="Enter video title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-file">Video File *</Label>
            <input
              id="video-file"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('video-file')?.click()}
                className="w-full"
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {file ? 'Change Video File' : 'Choose Video File'}
              </Button>
              {file && (
                <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-2">
                  <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail-file">Thumbnail (Optional)</Label>
            <input
              id="thumbnail-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('thumbnail-file')?.click()}
                className="w-full"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {thumbnail ? 'Change Thumbnail' : 'Choose Thumbnail'}
              </Button>
              {thumbnail && (
                <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-2">
                  <span className="text-sm text-foreground truncate flex-1">{thumbnail.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => setThumbnail(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
