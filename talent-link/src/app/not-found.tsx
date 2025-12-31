'use client'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Frown } from 'lucide-react'

export default function NotFound() {
  const t = useTranslations('NotFound')
  const router = useRouter()
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 -z-10"
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
      <div className="flex flex-1 flex-col overflow-y-auto z-10">
        <div className="p-4">
          <div className="flex justify-center gap-2">
            <Link href="/">
              <Image
                src="/TalentLink.svg"
                alt={t('logoAlt')}
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center lg:p-10 min-h-[70vh] w-full">
          <div className="w-full max-w-sm size-full justify-center">
            <div className="flex flex-col items-center gap-2">
              <Frown className="z-10 size-10" />
              <h2 className="text-2xl font-bold z-10">{t('title')}</h2>
              <p className="z-10">{t('description')}</p>
              <Button
                onClick={() => {
                  router.replace('/')
                }}
                variant="link"
                size="lg"
                className="z-10 hover:cursor-pointer text-md"
              >
                {t('back')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
