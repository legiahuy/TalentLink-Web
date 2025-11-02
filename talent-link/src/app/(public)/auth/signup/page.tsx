import { SignupForm } from '@/components/auth/signup-form'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth.signup')

  return {
    title: t('pageTitle'),
  }
}

export default function SignupPage() {
  return <SignupForm />
}
