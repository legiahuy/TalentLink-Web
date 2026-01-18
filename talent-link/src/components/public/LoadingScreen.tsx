'use client'
import { LoaderIcon } from 'lucide-react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-primary/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 blur-[100px] rounded-full" />
      </div> 
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <LoaderIcon className="animate-spin size-5" role="status" aria-label="Loading" />
        <p className="text-md text-black z-10">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
