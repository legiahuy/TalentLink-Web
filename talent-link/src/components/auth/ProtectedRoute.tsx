'use client'

import type { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname)
      router.push(`/auth/login?returnUrl=${returnUrl}`)
    }
  }, [isAuthenticated, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
