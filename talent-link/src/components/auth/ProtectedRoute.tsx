// components/auth/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Loader } from 'lucide-react'

export default function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const router = useRouter()
  const { user, isInitialized } = useAuthStore()

  useEffect(() => {
    if (isInitialized && !user) {
      router.push(redirectTo)
    }
  }, [isInitialized, user, router, redirectTo])

  // Đang check auth - show loading
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    )
  }

  // Checked xong mà ko có user - đang redirect
  if (!user) {
    return null
  }

  return <>{children}</>
}
