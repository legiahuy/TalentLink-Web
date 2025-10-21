// import { lazy } from 'react';
import ProtectedRoute from '@/auth/ProtectedRoute';
import AppLayout from '@/layouts/AppLayout';
// const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'));
// const ProfilePage = lazy(() => import('@/pages/app/ProfilePage'));

export const appRoutes = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // { path: '/app', element: <DashboardPage /> },
          // { path: '/app/profile', element: <ProfilePage /> },
          // Example of role-based route:
          // { path: '/app/admin', element: lazy(() => import('@/pages/app/AdminPage')), requireRoles: ['admin'] }
        ],
      },
    ],
  },
];