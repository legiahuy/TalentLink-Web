import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './auth';
import { appRoutes } from './app';
import { lazy } from 'react';

const Root = lazy(() => import('@/App'));
// const Forbidden = lazy(() => import('@/pages/ForbiddenPage'));
// const NotFound = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  { path: '/', element: <Root /> },
  ...authRoutes,
  ...appRoutes,
  // { path: '/forbidden', element: <Forbidden /> },
  // { path: '*', element: <NotFound /> },
]);