'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import { startGoogleOAuth } from '@/lib/oauth'

type SignUpFormValues = {
  display_name: string
  username: string
  email: string
  password: string
  confirmPassword: string
  role?: 'producer' | 'singer' | 'venue'
}

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
  const t = useTranslations('Auth.signup')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const signUpSchema = z
    .object({
      display_name: z.string().min(1, t('displaynameMinLength')),
      username: z.string().min(3, t('usernameMinLength')),
      email: z.email(t('emailInvalid')),
      password: z.string().min(6, t('passwordMinLength')),
      confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
      role: z.enum(['producer', 'singer', 'venue']).optional(),
    })
    .refine((data) => data.role, {
      message: t('roleRequired'),
      path: ['role'],
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('confirmPasswordMismatch'),
      path: ['confirmPassword'],
    })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) })

  const { signUp } = useAuthStore()

  const onSubmit = async (data: SignUpFormValues) => {
    // TODO: Implement signup logic

    const { display_name, username, email, password, role } = data
    await signUp(display_name, username, email, password, role!)
    router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
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
          <Label htmlFor="display_name" className="block text-sm">
            {t('displayname')}
          </Label>
          <Input
            type="text"
            id="display_name"
            placeholder={t('displaynamePlaceholder')}
            {...register('display_name')}
          />
          {errors.display_name && (
            <p className="text-destructive text-xs">{errors.display_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="username" className="block text-sm">
            {t('username')}
          </Label>
          <Input
            type="text"
            id="username"
            placeholder={t('usernamePlaceholder')}
            {...register('username')}
          />
          {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
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
        <div className="flex flex-col gap-3">
          <Label htmlFor="role" className="block text-sm">
            {t('role')}
          </Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('rolePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="producer">{t('roleProducer')}</SelectItem>
                    <SelectItem value="singer">{t('roleSinger')}</SelectItem>
                    <SelectItem value="venue">{t('roleVenue')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-destructive text-xs">{errors.role.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            <Label htmlFor="password" className="block text-sm">
              {t('password')}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('passwordPlaceholder')}
                className="pr-10"
                {...register('password')}
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
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="confirmPassword" className="block text-sm">
              {t('confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              className="pr-10"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
        <Button
          variant="default"
          type="submit"
          className="w-full hover:cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </Button>

        <FieldSeparator>{t('continueWith')}</FieldSeparator>

        <Button
          variant="outline"
          type="button"
          className="w-full hover:cursor-pointer"
          onClick={() => {
            void startGoogleOAuth()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
          </svg>
          {t('signInWithGoogle')}
        </Button>
        <div className="text-center text-sm">
          {t('hasAccount')}{' '}
          <Link href="/auth/login" className="underline underline-offset-4">
            {t('login')}
          </Link>
        </div>
      </div>
    </form>
  )
}
