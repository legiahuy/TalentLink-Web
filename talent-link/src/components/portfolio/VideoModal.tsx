"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { videoService } from "@/services/videoService"
import { toast } from "sonner"

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
  const [title, setTitle] = useState(init?.title || "")
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
        toast.success("Đã cập nhật video!")
      } else {
        if (!file) {
          toast.error("Hãy chọn file video!")
          return
        }
        await videoService.uploadVideo({ file, thumbnail, title })
        toast.success("Đã tải lên video!")
      }

      setOpen(false)
      onUploaded()
    } catch (e) {
      console.error(e)
      toast.error("Lỗi khi lưu video")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{init ? "Chỉnh sửa video" : "Thêm video"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="font-medium">Tiêu đề video</label>
            <Input
              placeholder="Tên video..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Video</label>
            <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <div>
            <label className="font-medium">Thumbnail (tùy chọn)</label>
            <Input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
          </div>

          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu…" : "Lưu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
