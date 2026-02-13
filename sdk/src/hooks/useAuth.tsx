import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User, LoginData, RegisterData} from '../types';
import { AuthClient } from '../client/AuthClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, client }: { children: ReactNode; client: AuthClient }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client.isAuthenticated()) {
      setLoading(true);
      client.getCurrentUser()
        .then((user: User) => {
          setUser(user);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setLoading(false);
        });
    }
  }, [client]);

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const result = await client.login(data);
      setUser(result.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const result: any = await client.register(data);

      // If app requires email verification, the server returns { user, message } without tokens.
      if (!result?.accessToken || !result?.refreshToken) {
        setUser(null);
        setLoading(false);
        throw new Error(result?.message || 'Registration succeeded. Please verify your email before logging in.');
      }

      setUser(result.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await client.logout();
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logoutAll = async () => {
    setLoading(true);
    try {
      await client.logoutAll();
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    logoutAll,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
