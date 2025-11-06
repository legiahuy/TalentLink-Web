// components/auth/RedirectAuthenticated.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Loader } from 'lucide-react'

export default function RedirectAuthenticated({
  children,
  redirectTo = '/profile/artist-profile',
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const router = useRouter()
  const { user, isInitialized } = useAuthStore()

  useEffect(() => {
    if (isInitialized && user) {
      router.push(redirectTo)
    }
  }, [isInitialized, user, router, redirectTo])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    )
  }

  if (user) {
    return null // Đang redirect
  }

  return <>{children}</>
}
