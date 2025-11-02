'use client'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from '@/components/ui/drawer'
import React, { useState } from 'react'

export default function LangSwitch() {
  const router = useRouter()
  const locale = useLocale()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const t = useTranslations('LanguageSwitcher')

  const changeLanguage = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    router.refresh()
    setIsDrawerOpen(false)
    // Blur any focused element to prevent border/ring from appearing
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }
  return (
    <React.Fragment>
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-0! focus:outline-none focus:ring-0! border-none! ring-0!"
            >
              <GlobeIcon className="h-5 w-5" />
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-35">
            <DropdownMenuItem
              className="flex items-center justify-between focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:ring-0"
              onClick={() => changeLanguage('en')}
            >
              <span>{t('english')}</span>
              {locale === 'en' && <CheckIcon className="h-5 w-5" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeLanguage('vi')}
              className="flex items-center justify-between focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:ring-0"
            >
              <span>{t('vietnamese')}</span>
              {locale === 'vi' && <CheckIcon className="h-5 w-5" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="md:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="link" className="flex items-center gap-2 focus-visible:outline-none">
              <GlobeIcon className="h-5 w-5" />
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="grid gap-4 p-4">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-lg font-medium">{t('action')}</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <XIcon className="h-5 w-5" />
                  </Button>
                </DrawerClose>
              </div>
              <div className="grid gap-2">
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => changeLanguage('en')}
                >
                  <GlobeIcon className="h-5 w-5" />
                  <span>{t('english')}</span>
                  {locale === 'en' && <CheckIcon className="h-5 w-5 ml-auto" />}
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => changeLanguage('vi')}
                >
                  <GlobeIcon className="h-5 w-5" />
                  <span>{t('vietnamese')}</span>
                  {locale === 'vi' && <CheckIcon className="h-5 w-5 ml-auto" />}
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </React.Fragment>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
