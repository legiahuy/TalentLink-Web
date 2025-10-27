import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../utils/permissions';
import { UserRole } from '../types';

interface ProtectedRouteProps {
    roles?: UserRole[];
    redirectTo?: string;
}

export const ProtectedRoute = ({
    roles,
    redirectTo = '/auth/login',
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (roles && user && !hasPermission(user.role, roles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};
