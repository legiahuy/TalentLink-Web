import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth.forgotPassword')

  return {
    title: t('pageTitle'),
  }
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
