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
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type ForgotEmailFormValues = { email: string }
type ResetPasswordFormValues = { password: string; confirmPassword: string }

type Step = 'request' | 'verify' | 'reset'

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const t = useTranslations('Auth.forgotPassword')
  const router = useRouter()

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
      password: z.string().min(6, t('passwordMinLength')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('confirmPasswordMismatch'),
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
  const [showPassword, setShowPassword] = React.useState(false)

  const submitEmail = async (data: ForgotEmailFormValues) => {
    try {
      await requestPasswordReset(data.email)
      setEmail(data.email)
      setStep('verify')
      toast.success(t('requestSuccess'))
    } catch {
      toast.error(t('emailNotExist'))
    }
  }

  const submitVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      toast.error(t('emailMissing'))
      return
    }
    if (code.length !== 6) return
    setVerifying(true)
    try {
      const token = await confirmPasswordReset(email, code)
      setResetToken(token)
      setStep('reset')
      toast.success(t('verifySuccess'))
    } catch {
      toast.error(t('verifyError'))
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error(t('emailMissing'))
      return
    }
    setResending(true)
    try {
      await resendPasswordReset(email)
      toast.success(t('resendSuccess'))
    } catch {
      toast.error(t('resendError'))
    } finally {
      setResending(false)
    }
  }

  const submitResetPassword = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword(email || getEmailValues('email'), data.password, resetToken)
      toast.success(t('resetSuccess'))
      router.replace('/auth/login')
    } catch {
      toast.error(t('resetError'))
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
              <FieldDescription className="text-center">{t('otpDescription')}</FieldDescription>
            </Field>
            <Button type="submit" disabled={code.length !== 6 || verifying} className="w-full">
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t('verifying')}
                </>
              ) : (
                t('verify')
              )}
            </Button>
            <div className="text-center text-sm">
              {t('notReceived')}{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="underline underline-offset-4 hover:cursor-pointer"
              >
                {resending ? t('resending') : t('resend')}
              </button>
            </div>
          </FieldGroup>
        )}

        {step === 'reset' && (
          <FieldGroup>
            <div className="flex flex-col gap-3">
              <Label htmlFor="password" className="block text-sm">
                {t('newPassword')}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="pr-10"
                  {...registerReset('password')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {resetErrors.password && (
                <p className="text-destructive text-xs">{resetErrors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="confirmPassword" className="block text-sm">
                {t('confirmNewPassword')}
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
                  <Loader2 className="h-4 w-4 animate-spin" /> {t('resetting')}
                </>
              ) : (
                t('reset')
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
