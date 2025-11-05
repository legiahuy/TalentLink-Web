import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-lvh min-h-lvh flex-col overflow-x-clip">
        <Header />

        <main className="mx-auto w-full grow">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
