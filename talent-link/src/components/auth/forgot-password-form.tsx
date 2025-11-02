'use client'
import Link from 'next/link'
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

type ForgotFormValues = {
  email: string
}

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const t = useTranslations('Auth.forgotPassword')

  const forgotSchema = z.object({
    email: z.email(t('emailInvalid')),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({ resolver: zodResolver(forgotSchema) })
  const { login } = useAuthStore()
  const onSubmit = async (data: ForgotFormValues) => {
    const { email } = data
    await login(email)
    // try {
    //   await login(email, password)
    //   navigate('/users/dashboard')
    // } catch {
    //   //STAY ON PAGE
    // }
  }
  return (
    <form
      className={cn('flex flex-col gap-3', className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col gap-5">
        <div className="mb-3 flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t('subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="email" className="block text-sm">
            {t('email')}
          </Label>
          <Input
            type="email"
            id="email"
            placeholder={t('emailPlaceholder')}
            {...register('email')}
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <Button variant="default" type="submit" className="w-full" disabled={isSubmitting}>
          {t('submit')}
        </Button>
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
