/* eslint-disable react-refresh/only-export-components */
// src/auth/AuthContext.tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type User = {
  id: string;
  email: string;
  roles: string[];
};

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('session');
    if (stored) {
      const { user: u, token: t } = JSON.parse(stored);
      setUser(u);
      setToken(t);
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    void _password;
    // Call your API here
    const fakeUser: User = { id: '1', email, roles: ['user'] };
    const fakeToken = 'token';
    setUser(fakeUser);
    setToken(fakeToken);
    localStorage.setItem('session', JSON.stringify({ user: fakeUser, token: fakeToken }));
    setStatus('authenticated');
  }, []);

  const signup = useCallback(async (_data: Record<string, unknown>) => {
    void _data;
    // Call your API here, then log in or route to verify
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('session');
    setStatus('unauthenticated');
  }, []);

  const hasRole = useCallback((role: string) => Boolean(user?.roles?.includes(role)), [user]);

  const value = useMemo(
    () => ({ status, user, token, login, signup, logout, hasRole }),
    [status, user, token, login, signup, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}