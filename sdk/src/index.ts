export { AuthClient } from './client/AuthClient';
export { useAuth, AuthProvider } from './hooks';
export type { 
  AuthConfig, 
  RegisterData, 
  LoginData, 
  ResetPasswordData, 
  User, 
  AuthResponse, 
  Session 
} from './types';

export { AuthClient as default } from './client/AuthClient';
