'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup } from '@/components/ui/field'

type Role = 'producer' | 'singer' | 'venue'

export default function CompleteOAuthPage() {
  const router = useRouter()
  const t = useTranslations('Auth.completeOAuth')
  const { pendingRegistrationToken, completeOAuth, loading } = useAuthStore()

  useEffect(() => {
    if (!pendingRegistrationToken) {
      router.replace('/auth/login')
    }
  }, [pendingRegistrationToken, router])

  const schema = z.object({
    username: z.string().min(3, t('usernameMinLength')),
    role: z.enum(['producer', 'singer', 'venue'], {
      message: t('roleRequired'),
    }),
  })

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    if (!pendingRegistrationToken) return

    await completeOAuth(pendingRegistrationToken, data.role as Role, data.username)
    router.replace('/')
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto py-10">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm text-balance">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <div className="flex flex-col gap-3">
            <Label htmlFor="username">{t('username')}</Label>
            <Input id="username" placeholder={t('usernamePlaceholder')} {...register('username')} />
            {errors.username && (
              <p className="text-destructive text-xs">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="role">{t('role')}</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder={t('rolePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="producer">Producer</SelectItem>
                      <SelectItem value="singer">Singer</SelectItem>
                      <SelectItem value="venue">Venue</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-destructive text-xs">{errors.role.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loading || !pendingRegistrationToken}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('submitting')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
