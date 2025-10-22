import AuthLayout from '@/layouts/AuthLayout';
import GuestLayout from '@/layouts/GuestLayout';
import SignupPage from '@/pages/auth/SignupPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            // { path: 'login', element: <LoginPage /> },
            { path: 'signup', element: <SignupPage /> },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/auth/signup" replace />,
    },
]);
