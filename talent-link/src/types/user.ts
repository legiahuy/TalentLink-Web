export const UserRole = {
    VENUE: 'venue',
    PRODUCER: 'producer',
    SINGER: 'singer',
    ADMIN: 'admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id: string;
    email: string;
    display_name: string;
    role: UserRole;
    avatar?: string;
}
