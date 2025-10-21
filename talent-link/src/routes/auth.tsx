import { lazy } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
// const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

export const authRoutes = [
  {
    path: '/auth',
    element: <PublicLayout />,
    children: [
      // { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      // { path: 'forgot-password', element: lazy(() => import('@/pages/auth/ForgotPasswordPage')) },
      // { path: 'reset-password', element: lazy(() => import('@/pages/auth/ResetPasswordPage')) },
      // { path: 'verify-email', element: lazy(() => import('@/pages/auth/VerifyEmailPage')) },
    ],
  },
];