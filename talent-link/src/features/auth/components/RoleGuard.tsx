import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { hasPermission } from '../utils/permissions';
import { UserRole } from '../types';

interface RoleGuardProps {
    roles: UserRole[];
    children: ReactNode;
    fallback?: ReactNode;
}

export const RoleGuard = ({
    roles,
    children,
    fallback = null,
}: RoleGuardProps) => {
    const { user } = useAuthStore();

    if (!user || !hasPermission(user.role, roles)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
