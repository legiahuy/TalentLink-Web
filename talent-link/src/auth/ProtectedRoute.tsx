import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ requireRoles }: { requireRoles?: string[] }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') return null; // Or loading UI

  if (status !== 'authenticated') {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (requireRoles?.length && !requireRoles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}