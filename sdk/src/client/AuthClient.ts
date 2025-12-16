import { HttpClient } from '../utils/http';
import { CookieManager } from '../utils/cookies';
import type { 
  AuthConfig, 
  RegisterData, 
  LoginData, 
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
    
    if (!this.accessToken && this.refreshToken) {
      this.refreshAccessToken().catch(() => {
        // If refresh fails on initialization, clear tokens silently
        this.clearTokens();
      });
    }
    
    this.http.setTokenRefreshCallback(async () => {
      if (!this.refreshToken) throw new Error('No refresh token');
      
      try {
        const result = await this.http.request<{ accessToken: string; refreshToken: string }>(
          '/api/auth/refresh',
          { method: 'POST' },
          this.refreshToken
        );

        this.setTokens(result.accessToken, result.refreshToken);
        return result.accessToken;
      } catch (error) {
        // Only clear tokens for specific token-related errors, not network/server errors
        if (error instanceof Error && (
          error.message.includes('Invalid or expired refresh token') ||
          error.message.includes('refresh token') ||
          (error.message.includes('HTTP 400') && error.message.includes('refresh')) ||
          (error.message.includes('HTTP 401') && error.message.includes('refresh'))
        )) {
          this.clearTokens();
        }
        // For other errors (network, server down, etc.), keep tokens and let retry happen
        throw error;
      }
    });
  }

  private async refreshAccessToken() {
    try {
      const result = await this.http.request<{ accessToken: string; refreshToken: string }>(
        '/api/auth/refresh',
        { method: 'POST' },
        this.refreshToken
      );
      
      this.setTokens(result.accessToken, result.refreshToken);
    } catch (error) {
      // Only clear tokens for specific token-related errors, not network/server errors
      if (error instanceof Error && (
        error.message.includes('Invalid or expired refresh token') ||
        error.message.includes('refresh token') ||
        (error.message.includes('HTTP 400') && error.message.includes('refresh')) ||
        (error.message.includes('HTTP 401') && error.message.includes('refresh'))
      )) {
        this.clearTokens();
      }
      throw error;
    }
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
    const refreshToken = this.refreshToken || CookieManager.getCookie('auth_refresh_token');

    if (refreshToken) {
      try {
        // Server expects refresh token in Authorization header
        await this.http.request<{ message: string }>('/api/auth/logout', { method: 'POST' }, refreshToken);
      } catch (error) {
        console.warn('Logout request failed, clearing local tokens:', error);
      }
    }

    this.clearTokens();
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(): Promise<User> {
    return this.http.request<User>('/api/auth/profile', {}, this.accessToken);
  }

  async logoutAll(): Promise<{ message: string }> {
    const result = await this.http.request<{ message: string }>('/api/auth/logout-all', {
      method: 'POST',
      body: JSON.stringify({}),
    }, this.accessToken);
    
    this.clearTokens();
    return result;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return this.http.request<{ message: string }>('/api/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.http.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }


  
  async getSessions(): Promise<Session[]> {
    const result = await this.http.request<{ sessions: Session[] }>('/api/auth/sessions', {}, this.accessToken);
    return result.sessions;
  }

  async refreshTokens(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.refreshToken || CookieManager.getCookie('auth_refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');

    const result = await this.http.request<{ accessToken: string; refreshToken: string }>(
      '/api/auth/refresh',
      { method: 'POST' },
      refreshToken
    );

    if (result.accessToken && result.refreshToken) {
      this.setTokens(result.accessToken, result.refreshToken);
    }

    return result;
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.accessToken;
    return hasToken;
  }
}
