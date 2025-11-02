'use client'

import { useAuthStore } from '@/stores/authStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface RedirectAuthenticatedUserProps {
  children: ReactNode
}

const RedirectAuthenticatedUser: React.FC<RedirectAuthenticatedUserProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const returnUrl = searchParams.get('returnUrl')
      const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : '/'
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, router, searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default RedirectAuthenticatedUser
