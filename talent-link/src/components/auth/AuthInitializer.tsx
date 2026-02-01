'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import LoadingScreen from '@/components/public/LoadingScreen'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // if (!isInitialized) {
  //   return <LoadingScreen />
  // }

  return <>{children}</>
}
