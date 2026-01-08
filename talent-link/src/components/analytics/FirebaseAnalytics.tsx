'use client'

import { useEffect } from 'react'
import { initAnalytics } from '@/lib/analytics'

export function FirebaseAnalytics() {
  useEffect(() => {
    // Initialize Firebase Analytics on client-side only
    initAnalytics().catch((error) => {
      console.error('Failed to initialize Firebase Analytics:', error)
    })
  }, [])

  return null // This component doesn't render anything
}
