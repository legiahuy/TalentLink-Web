import { LoginForm } from '@/components/auth/login-form'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth.login')

  return {
    title: t('pageTitle'),
  }
}

export default function LoginPage() {
  return <LoginForm />
}
