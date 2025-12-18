'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { OAUTH_CODE_VERIFIER_KEY } from '@/lib/oauth'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { oauthLogin, pendingRegistrationToken } = useAuthStore()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      toast.error('Google sign-in was cancelled or failed.')
      router.replace('/auth/login')
      return
    }

    if (!code) {
      toast.error('Missing authorization code from Google.')
      router.replace('/auth/login')
      return
    }

    const codeVerifier = sessionStorage.getItem(OAUTH_CODE_VERIFIER_KEY)
    if (!codeVerifier) {
      toast.error('Missing OAuth code verifier. Please try signing in again.')
      router.replace('/auth/login')
      return
    }

    sessionStorage.removeItem(OAUTH_CODE_VERIFIER_KEY)

    ;(async () => {
      try {
        await oauthLogin(code, codeVerifier)

        if (pendingRegistrationToken) {
          router.replace('/auth/complete-oauth')
        } else {
          router.replace('/')
        }
      } catch {
        // Error already toasted in store
        router.replace('/auth/login')
      }
    })()
  }, [oauthLogin, pendingRegistrationToken, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm text-muted-foreground">Completing Google sign-in...</p>
        <Button variant="ghost" size="sm" onClick={() => router.replace('/auth/login')}>
          Back to login
        </Button>
      </div>
    </div>
  )
}


