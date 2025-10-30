import AuthLayout from '@/layouts/AuthLayout';
import GuestLayout from '@/layouts/GuestLayout';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import LoginPage from '@/pages/auth/LoginPage';
import LogoutPage from '@/pages/auth/LogoutPage';
import SignupPage from '@/pages/auth/SignupPage';
import ProtectedRoute from '@/components/features/auth/ProtectedRoute';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RedirectAuthenticatedUser from '@/components/features/auth/RedirectAuthenticatedUser';
import LandingPage from '@/pages/LandingPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout><LandingPage /></GuestLayout>,
    },
    {
        path: '/auth',
        element: (
            <RedirectAuthenticatedUser>
                <AuthLayout />
            </RedirectAuthenticatedUser>),
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'signup', element: <SignupPage /> },
            { path: 'forgot-password', element: <ForgotPasswordPage /> },
        ],
    },
    {
        path: '/logout',
        element: <ProtectedRoute><LogoutPage /></ProtectedRoute>,
    },
    {
        path: '/unauthorized',
        element: <div>Unauthorized Access</div>,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
