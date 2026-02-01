'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { messageService } from '@/services/messageService'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

import { JobPost } from '@/types/job'

interface JobMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: JobPost & { creator_display_name?: string } // Ensure we have display name ability
}

export default function JobMessageDialog({
  open,
  onOpenChange,
  job,
}: JobMessageDialogProps) {
  const t = useTranslations('JobDetail')
  const tCommon = useTranslations('Common')
  
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    setIsSending(true)
    try {
      // Create special formatted content for job referencing
      // This pattern :::JOB_REF:JSON::: will be parsed by MessageThread
      
      // Format budget string
      let budget = ''
      if (job.budget_min !== undefined) {
         const currency = job.budget_currency || 'VND'
         if (job.budget_max) {
            budget = `${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()} ${currency}`
         } else {
            budget = `${job.budget_min.toLocaleString()} ${currency}`
         }
      }

      const jobContext = {
        id: job.id,
        title: job.title,
        companyName: job.creator_display_name || tCommon('unknown'),
        location: job.location,
        type: job.post_type,
        budget: budget,
        description: job.brief_description || job.description
      }
      
      const formattedContent = `:::JOB_REF:${JSON.stringify(jobContext)}:::\n${message.trim()}`

      await messageService.sendMessage({
        recipientId: job.creator_id,
        content: formattedContent
      })

      toast.success(tCommon('success'), {
        description: t('messageSent'),
      })
      
      setMessage('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error(tCommon('error'), {
        description: tCommon('tryAgain'),
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('sendMessageTo', { name: job.creator_display_name || tCommon('unknown') })}</DialogTitle>
          <DialogDescription>
            {t.rich('messageAbout', {
              jobTitle: job.title,
              highlight: (chunks) => <span className="font-medium text-foreground">{chunks}</span>
            })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            placeholder={t('messagePlaceholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleSend} disabled={!message.trim() || isSending}>
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {tCommon('sending')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {tCommon('send')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
