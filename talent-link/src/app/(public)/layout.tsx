import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'

export default function GuestLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-lvh min-h-lvh flex-col overflow-x-clip">
      {/* <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none  " />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-primary/15 blur-[130px] rounded-full pointer-events-none  " />
      <div className="fixed top-1/2 left-0 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none  " /> */}
      <Header />

      <main className="mx-auto w-full grow bg-background">{children}</main>
      <Footer />
    </div>
  )
}
