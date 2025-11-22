import type { ReactNode } from "react";
import type { AuthClient } from "../client/AuthClient";
export interface AuthConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Session {
  id: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  location?: string;
  ipAddress?: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children : ReactNode;
  client: AuthClient;
}
