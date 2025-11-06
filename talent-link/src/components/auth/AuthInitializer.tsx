'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Loader } from 'lucide-react'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    )
  }

  return <>{children}</>
}
