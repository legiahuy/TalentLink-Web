'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { Loader2 } from 'lucide-react'

export function OTPForm({ className, ...props }: React.ComponentProps<'div'>) {
  const t = useTranslations('Auth.verifyEmail')
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!email) {
        toast.error(t('emailMissing'))
        return
      }
      if (code.length !== 6) return
      setSubmitting(true)
      try {
        await authService.verifyEmail(email, code)
        toast.success(t('verifySuccess'))
        router.replace('/')
      } catch (err) {
        toast.error(authService.getErrorMessage(err, t('verifyError')))
      } finally {
        setSubmitting(false)
      }
    },
    [code, email, router, t],
  )

  const handleResend = useCallback(async () => {
    if (!email) {
      toast.error(t('emailMissing'))
      return
    }
    setResending(true)
    try {
      await authService.resendVerificationEmail(email)
      toast.success(t('resendSuccess'))
    } catch (err) {
      toast.error(authService.getErrorMessage(err, t('resendError')))
    } finally {
      setResending(false)
    }
  }, [email, t])

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground text-sm text-balance">{t('subtitle')}</p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              {t('label')}
            </FieldLabel>
            <InputOTP maxLength={6} id="otp" required value={code} onChange={setCode}>
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">{t('description')}</FieldDescription>
          </Field>
          <Button type="submit" disabled={code.length !== 6 || submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              t('verify')
            )}
          </Button>
          <FieldDescription className="text-center">
            {t('notReceived')}{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="underline underline-offset-4"
            >
              {resending ? t('resending') : t('resend')}
            </button>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}
