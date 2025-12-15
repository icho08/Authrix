import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthrixClient } from '../lib/authrixClient';
import type { User } from '../lib/types';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../lib/storage';
import { HttpError } from '../lib/http';

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { email: string; password: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const client = new AuthrixClient();

async function safeLoadProfile(): Promise<User | null> {
  const access = getAccessToken();
  if (!access) return null;
  try {
    return await client.getProfile(access);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const u1 = await safeLoadProfile();
      if (!cancelled && u1) {
        setUser(u1);
        setLoading(false);
        return;
      }

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const tokens = await client.refresh(refreshToken);
          setTokens(tokens.accessToken, tokens.refreshToken);
          const u2 = await client.getProfile(tokens.accessToken);
          if (!cancelled) setUser(u2);
        } catch {
          clearTokens();
          if (!cancelled) setUser(null);
        }
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthState>(() => {
    return {
      user,
      loading,
      login: async ({ email, password }) => {
        setLoading(true);
        try {
          const res = await client.login({ email, password });
          setTokens(res.accessToken, res.refreshToken);
          const profile = await client.getProfile(res.accessToken);
          setUser(profile);
        } finally {
          setLoading(false);
        }
      },
      register: async ({ email, password, username }) => {
        setLoading(true);
        try {
          const res: any = await client.register({ email, password, username });

          if (!res?.accessToken || !res?.refreshToken) {
            throw new Error(res?.message || 'Registration succeeded, but email verification is required before login.');
          }

          setTokens(res.accessToken, res.refreshToken);
          const profile = await client.getProfile(res.accessToken);
          setUser(profile);
        } finally {
          setLoading(false);
        }
      },
      logout: async () => {
        setLoading(true);
        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              await client.logout(refreshToken);
            } catch {
              // ignore
            }
          }
          clearTokens();
          setUser(null);
        } finally {
          setLoading(false);
        }
      },
      logoutAll: async () => {
        setLoading(true);
        try {
          const access = getAccessToken();
          if (!access) {
            clearTokens();
            setUser(null);
            return;
          }
          await client.logoutAll(access);
          clearTokens();
          setUser(null);
        } finally {
          setLoading(false);
        }
      },
      refresh: async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        try {
          const tokens = await client.refresh(refreshToken);
          setTokens(tokens.accessToken, tokens.refreshToken);
          const profile = await client.getProfile(tokens.accessToken);
          setUser(profile);
        } catch (e) {
          if (e instanceof HttpError && e.status === 401) {
            clearTokens();
            setUser(null);
            return;
          }
          throw e;
        }
      }
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
