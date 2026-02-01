import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { AuthInitializer } from '@/components/auth/AuthInitializer'
import { FirebaseAnalytics } from '@/components/analytics/FirebaseAnalytics'
import { SocketProvider } from '@/context/SocketContext'

const sans = Plus_Jakarta_Sans({ variable: '--font-sans', subsets: ['latin'] })
const serif = Lora({ variable: '--font-serif', subsets: ['latin'] })
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plexmono',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | TalentLink',
    default: 'TalentLink',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
        <FirebaseAnalytics />
        <AuthInitializer>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
          <Toaster position="top-right" richColors />
        </AuthInitializer>
      </body>
    </html>
  )
}
