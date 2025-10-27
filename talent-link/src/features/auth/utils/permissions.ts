import { UserRole } from '../types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
    [UserRole.GUEST]: 0,
    [UserRole.USER]: 1,
    [UserRole.ARTIST]: 2,
    [UserRole.ADMIN]: 3,
};

export const hasPermission = (
    userRole: UserRole,
    requiredRoles: UserRole[],
): boolean => {
    return requiredRoles.includes(userRole);
};

export const hasMinimumRole = (
    userRole: UserRole,
    minimumRole: UserRole,
): boolean => {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
};
