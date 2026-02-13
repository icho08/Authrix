export { AuthClient } from './client/AuthClient';
export { useAuth, AuthProvider } from './hooks';
export { logger, createLogger } from './utils/logger';
export type { 
  AuthConfig, 
  RegisterData, 
  LoginData, 
  ResetPasswordData, 
  User, 
  AuthResponse, 
  Session ,
  UpdateProfileData,
  ChangePasswordData,
} from './types';

export { AuthClient as default } from './client/AuthClient';
