'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

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

type Role = 'producer' | 'singer' | 'venue'

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  role: z.enum(['producer', 'singer', 'venue']),
})

type FormValues = z.infer<typeof schema>

export default function CompleteOAuthPage() {
  const router = useRouter()
  const { pendingRegistrationToken, completeOAuth, loading } = useAuthStore()

  useEffect(() => {
    if (!pendingRegistrationToken) {
      router.replace('/auth/login')
    }
  }, [pendingRegistrationToken, router])

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Complete your account</h1>
          <p className="text-sm text-muted-foreground">
            Choose your role and username to finish signing up with Google.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="yourname" {...register('username')} />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
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
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loading || !pendingRegistrationToken}
          >
            {isSubmitting || loading ? 'Completing...' : 'Complete account'}
          </Button>
        </form>
      </div>
    </div>
  )
}


