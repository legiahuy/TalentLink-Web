'use client'
import Link from 'next/link'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type ForgotEmailFormValues = { email: string }
type ResetPasswordFormValues = { password: string; confirmPassword: string }

type Step = 'request' | 'verify' | 'reset'

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const t = useTranslations('Auth.forgotPassword')

  // Step 1: email schema
  const emailSchema = z.object({ email: z.email(t('emailInvalid')) })
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: requesting },
    getValues: getEmailValues,
  } = useForm<ForgotEmailFormValues>({ resolver: zodResolver(emailSchema) })

  // Step 3: reset password schema
  const resetSchema = z
    .object({
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors, isSubmitting: resetting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetSchema) })

  const {
    requestPasswordReset,
    resendPasswordReset,
    confirmPasswordReset,
    resetPassword,
    loading,
  } = useAuthStore()

  const [step, setStep] = React.useState<Step>('request')
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [verifying, setVerifying] = React.useState(false)
  const [resending, setResending] = React.useState(false)
  const [resetToken, setResetToken] = React.useState('')

  const submitEmail = async (data: ForgotEmailFormValues) => {
    try {
      await requestPasswordReset(data.email)
      setEmail(data.email)
      setStep('verify')
      toast.success('If the email exists, a reset code has been sent')
    } catch {
      toast.error('Email does not exist, please sign up first')
    }
  }

  const submitVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      toast.error('Missing email')
      return
    }
    if (code.length !== 6) return
    setVerifying(true)
    try {
      const token = await confirmPasswordReset(email, code)
      setResetToken(token)
      setStep('reset')
      toast.success('Reset code verified successfully')
    } catch {
      toast.error('Invalid ResetCode')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error('Missing email')
      return
    }
    setResending(true)
    try {
      await resendPasswordReset(email)
      toast.success('Reset code resent')
    } catch {
      toast.error('Failed to resend reset code')
    } finally {
      setResending(false)
    }
  }

  const submitResetPassword = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword(email || getEmailValues('email'), data.password, resetToken)
      toast.success('Password has been reset successfully')
    } catch {
      toast.error('Invalid or expired reset token')
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (step === 'request')
      return handleSubmitEmail(submitEmail)(e as unknown as React.BaseSyntheticEvent)
    if (step === 'verify') return submitVerify(e)
    if (step === 'reset')
      return handleSubmitReset(submitResetPassword)(e as unknown as React.BaseSyntheticEvent)
  }

  return (
    <form className={cn('flex flex-col gap-3', className)} onSubmit={onSubmit} {...props}>
      <div className="flex flex-col gap-5">
        <div className="mb-3 flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t('subtitle')}</p>
        </div>

        {step === 'request' && (
          <FieldGroup>
            <div className="flex flex-col gap-3">
              <Label htmlFor="email" className="block text-sm">
                {t('email')}
              </Label>
              <Input
                type="email"
                id="email"
                placeholder={t('emailPlaceholder')}
                {...registerEmail('email')}
              />
              {emailErrors.email && (
                <p className="text-destructive text-xs">{emailErrors.email.message}</p>
              )}
            </div>
            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={requesting || loading}
            >
              {requesting || loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('submit')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </FieldGroup>
        )}

        {step === 'verify' && (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp" className="sr-only">
                OTP
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
              <FieldDescription className="text-center">
                Enter the 6-digit code sent to your email
              </FieldDescription>
            </Field>
            <Button type="submit" disabled={code.length !== 6 || verifying} className="w-full">
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying
                </>
              ) : (
                'Verify'
              )}
            </Button>
            <div className="text-center text-sm">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="underline underline-offset-4 hover:cursor-pointer"
              >
                {resending ? 'Resending...' : 'Resend'}
              </button>
            </div>
          </FieldGroup>
        )}

        {step === 'reset' && (
          <FieldGroup>
            <div className="flex flex-col gap-3">
              <Label htmlFor="password" className="block text-sm">
                New password
              </Label>
              <Input type="password" id="password" {...registerReset('password')} />
              {resetErrors.password && (
                <p className="text-destructive text-xs">{resetErrors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="confirmPassword" className="block text-sm">
                Confirm new password
              </Label>
              <Input type="password" id="confirmPassword" {...registerReset('confirmPassword')} />
              {resetErrors.confirmPassword && (
                <p className="text-destructive text-xs">{resetErrors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={resetting || loading}
            >
              {resetting || loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Resetting
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </FieldGroup>
        )}

        <FieldSeparator />
        <div className="text-center text-sm">
          <div className="flex flex-row items-center justify-center gap-1 text-center">
            <Link href="/auth/login" className="underline underline-offset-4">
              {t('backToLogin')}
            </Link>
            <ArrowRight className="h-4" />
          </div>
        </div>
      </div>
    </form>
  )
}
