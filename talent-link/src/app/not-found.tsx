'use client'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Frown } from 'lucide-react'
import Footer from '@/components/public/Footer'
import Header from '@/components/public/Header'

export default function NotFound() {
  const t = useTranslations('NotFound')
  const router = useRouter()
  return (
    <>
    

    <div className="relative flex min-h-screen flex-col w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-50 mt-4 px-4 sm:px-8">
        <Header />
      </div>
      
     <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-primary/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 blur-[100px] rounded-full" />
      </div> 
      
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 pt-20">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary/10 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('title')}</h2>
            </div>
          </div>
          <p className="text-xl text-muted-foreground">{t('description')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm dark:hover:from-primary/80 hover:from-primary/70 dark:hover:to-primary/70 hover:to-primary/90 from-primary/60 to-primary/100 dark:from-primary/100 dark:to-primary/70 border-t-primary h-10 rounded-md px-5 bg-primary text-primary-foreground hover:bg-primary/90" href="/">
              {t('backToHome')}
            </Link>
            <Link className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-xs hover:text-accent-foreground h-10 rounded-md px-5 border-primary/20 hover:bg-primary/10" href="/jobs">
              {t('exploreProducts')}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 w-full mt-10">
        <Footer />
      </div>
    </div>
    
    </>
  )
}
