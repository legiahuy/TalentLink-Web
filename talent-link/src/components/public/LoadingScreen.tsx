'use client'
import { LoaderIcon } from 'lucide-react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(229,231,235,0.8) 0.3px, transparent 1px),
        linear-gradient(to bottom, rgba(229,231,235,0.8) 0.3px, transparent 1px),
        radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
        radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
      `,
          backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <LoaderIcon className="animate-spin size-5" role="status" aria-label="Loading" />
        <p className="text-md text-black z-10">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
