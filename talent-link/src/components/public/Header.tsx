'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useTranslations } from 'next-intl'
import LangSwitch from '@/components/public/LangSwitch'

const Header = () => {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const t = useTranslations('Header')

  const navigationItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/discovery', label: t('navigation.discovery') },
    { href: '/jobs', label: t('navigation.jobs') },
    { href: '/about', label: t('navigation.about') },
  ]

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex w-full select-none items-center justify-center px-4 py-2 md:px-8">
      <div className="w-full rounded-xl border border-border/30 bg-background/60 backdrop-blur-xl shadow-sm supports-backdrop-filter:bg-background/40 ">
        <div className="mx-auto w-full max-w-[1320px] flex justify-between items-center px-4 py-2 md:px-6">
          {/* Logo */}
          <Link href="/" className="transition-opacity hover:opacity-80 shrink-0">
            <Image
              src="/TalentLink.svg"
              alt="TalentLink Logo"
              width={120}
              height={32}
              className="h-7 w-auto sm:h-7"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  } text-sm font-medium transition-colors hover:text-foreground`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Buttons and Language Switcher */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div>Xin Chào, {user?.display_name}</div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signup">{t('signup')}</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/auth/login">{t('login')}</Link>
                </Button>
              </>
            )}
            <LangSwitch />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
