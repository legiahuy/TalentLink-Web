'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useTranslations } from 'next-intl'
import LangSwitch from '@/components/public/LangSwitch'
import { User, Settings, LogOut, MessageCircle, Briefcase, Inbox } from 'lucide-react'
import { resolveMediaUrl } from '@/lib/utils'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()
  const t = useTranslations('Header')

  const navigationItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/discovery', label: t('navigation.discovery') },
    { href: '/jobs', label: t('navigation.jobs') },
    { href: '/about', label: t('navigation.about') },
  ]

  const router = useRouter()
  const handleLogout = () => {
    try {
      logout()
      router.push('/auth/login')
    } catch (error) {
      console.error(error)
    }
  }

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
              <>
                <Button variant="link" size="icon" className="h-9 w-9" asChild>
                  <Link href="/messages">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full p-0 hover:opacity-80"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.avatar_url ? resolveMediaUrl(user.avatar_url) : undefined}
                          alt={user?.display_name || user?.username || 'User'}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user?.display_name?.charAt(0).toUpperCase() ||
                            user?.username?.charAt(0).toUpperCase() ||
                            'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.display_name || user?.username || 'User'}
                        </p>
                        {user?.email && (
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={user?.username ? `/profile/${user.username}` : '/settings/my-profile'}
                        className="flex items-center cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('userMenu.myProfile')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={'/jobs/my-posts'} className="flex items-center cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>My job posts</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={'/jobs/my-applications'}
                        className="flex items-center cursor-pointer"
                      >
                        <Inbox className="mr-2 h-4 w-4" />
                        <span>My applications</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/settings/my-profile"
                        className="flex items-center cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('userMenu.settings')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('userMenu.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
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
