'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <ProtectedRoute>
    <div className="flex h-lvh min-h-lvh flex-col overflow-x-clip">
      {!isAdminRoute && <Header />}

      <main className="mx-auto w-full grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
   </ProtectedRoute>
  )
}
