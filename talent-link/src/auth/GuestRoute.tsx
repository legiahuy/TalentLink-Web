import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Outlet } from 'react-router-dom';

export default function GuestRoute() {
  const { status } = useAuth();
  if (status === 'loading') return null;
  if (status === 'authenticated') return <Navigate to="/app" replace />;
  return <Outlet />;
}