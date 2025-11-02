import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default function GuestLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-lvh min-h-lvh flex-col overflow-x-clip">
      <Header />

      <main className="mx-auto w-full grow">{children}</main>
      <Footer />
    </div>
  )
}
