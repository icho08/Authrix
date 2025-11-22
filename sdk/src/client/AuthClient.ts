import { HttpClient } from '../utils/http';
import { CookieManager } from '../utils/cookies';
import type { 
  AuthConfig, 
  RegisterData, 
  LoginData, 
  ResetPasswordData, 
  User, 
  AuthResponse, 
  Session 
} from '../types';

export class AuthClient {
  private http: HttpClient;
  private accessToken?: string;
  private refreshToken?: string;
  
  constructor(config: AuthConfig) {
    const baseUrl = config.baseUrl || 'http://localhost:3000';
    this.http = new HttpClient(baseUrl, config.apiKey);
    
    this.accessToken = CookieManager.getCookie('auth_access_token') || undefined;
    this.refreshToken = CookieManager.getCookie('auth_refresh_token') || undefined;
    
    this.http.setTokenRefreshCallback(async () => {
      if (!this.refreshToken) throw new Error('No refresh token');
      
      const result = await this.http.request<AuthResponse>('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      
      this.setTokens(result.accessToken, result.refreshToken);
      return result.accessToken;
    });
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    CookieManager.setCookie('auth_access_token', accessToken, 1); 
    CookieManager.setCookie('auth_refresh_token', refreshToken, 30);
  }

  private clearTokens() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    CookieManager.deleteCookie('auth_access_token');
    CookieManager.deleteCookie('auth_refresh_token');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const result = await this.http.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.accessToken && result.refreshToken) {
      this.setTokens(result.accessToken, result.refreshToken);
    }
    
    return result;
  }

  async login(data: LoginData): Promise<AuthResponse> { 
    const result = await this.http.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (result.accessToken && result.refreshToken) {
      this.setTokens(result.accessToken, result.refreshToken);
    }
    
    return result;
  }

  async logout(): Promise<{ message: string }> {
    if (this.refreshToken) {
      await this.http.request<{ message: string }>('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    }
    
    this.clearTokens();
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(): Promise<User> {
    return this.http.request<User>('/api/auth/profile', {}, this.accessToken);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}
