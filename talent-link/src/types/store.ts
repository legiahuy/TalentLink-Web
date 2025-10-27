import type { User } from './user';

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    isLoading: boolean;

    signUp: (
        username: string,
        email: string,
        password: string,
        role: string,
    ) => Promise<void>;

    login: (email: string, password: string) => Promise<void>;
}
