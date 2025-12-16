import { useState, useEffect, type ReactNode } from 'react';
import type { User, LoginData, RegisterData} from '../types';
import { AuthClient } from '../client/AuthClient';
// Global state
let globalClient: AuthClient | null = null;
let globalUser: User | null = null;
let globalLoading = false;
let subscribers: Set<() => void> = new Set();

function notify() {
  subscribers.forEach(callback => callback());
}

export function AuthProvider({ children, client }: { children: ReactNode; client: AuthClient }) {
  if (!globalClient) {
    globalClient = client;
    
    if (client.isAuthenticated()) {
      globalLoading = true;
      client.getCurrentUser()
        .then((user: User) => {
          globalUser = user;
          globalLoading = false;
          notify();
        })
        .catch(() => {
          globalUser = null;
          globalLoading = false;
          notify();
        });
    }
  }
  
  return children as any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(globalUser);
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    const updateState = () => {
      setUser(globalUser);
      setLoading(globalLoading);
    };

    subscribers.add(updateState);
    
    return () => {
      subscribers.delete(updateState);
    };
  }, []);

  const login = async (data: LoginData) => {
    if (!globalClient) throw new Error('AuthProvider not found');
    
    globalLoading = true;
    notify();
    
    try {
      const result = await globalClient.login(data);
      globalUser = result.user;
      globalLoading = false;
      notify();
    } catch (error) {
      globalLoading = false;
      notify();
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    if (!globalClient) throw new Error('AuthProvider not found');

    globalLoading = true;
    notify();

    try {
      const result: any = await globalClient.register(data);

      // If app requires email verification, the server returns { user, message } without tokens.
      if (!result?.accessToken || !result?.refreshToken) {
        globalUser = null;
        globalLoading = false;
        notify();
        throw new Error(result?.message || 'Registration succeeded. Please verify your email before logging in.');
      }

      globalUser = result.user;
      globalLoading = false;
      notify();
    } catch (error) {
      globalLoading = false;
      notify();
      throw error;
    }
  };

  const logout = async () => {
    if (!globalClient) throw new Error('AuthProvider not found');

    globalLoading = true;
    notify();

    try {
      await globalClient.logout();
      globalUser = null;
      globalLoading = false;
      notify();
    } catch (error) {
      globalLoading = false;
      notify();
      throw error;
    }
  };

  const logoutAll = async () => {
    if (!globalClient) throw new Error('AuthProvider not found');

    globalLoading = true;
    notify();

    try {
      await globalClient.logoutAll();
      globalUser = null;
      globalLoading = false;
      notify();
    } catch (error) {
      globalLoading = false;
      notify();
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    logoutAll,
    isAuthenticated: !!user
  };
}
