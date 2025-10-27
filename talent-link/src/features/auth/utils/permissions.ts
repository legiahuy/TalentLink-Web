import { UserRole } from '../types';

export const hasPermission = (
    userRole: UserRole,
    requiredRoles: UserRole[],
): boolean => {
    return requiredRoles.includes(userRole);
};

export const hasAnyRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
    return allowedRoles.includes(userRole);
};

export const isAdmin = (userRole: UserRole): boolean => {
    return userRole === UserRole.ADMIN;
};

export const isVenue = (userRole: UserRole): boolean => {
    return userRole === UserRole.VENUE;
};
