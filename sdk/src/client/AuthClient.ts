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
    

    
    if (!this.accessToken && this.refreshToken) {
      console.log('🔄 No access token but have refresh token, refreshing...');
      this.refreshAccessToken();
    }
    
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

  private async refreshAccessToken() {
    try {
      console.log(' Refreshing with token:', this.refreshToken?.substring(0, 20) + '...');
      
      const result = await this.http.request<AuthResponse>('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      
      this.setTokens(result.accessToken, result.refreshToken);
      console.log('Access token refreshed successfully');
    } catch (error) {
      console.error(' Failed to refresh access token:', error);
      console.log(' Clearing invalid tokens...');
      this.clearTokens();
    }
  }

  private setTokens(accessToken: string, refreshToken: string) {
    console.log(' Setting tokens:', {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length,
      refreshTokenLength: refreshToken?.length
    });
    
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    CookieManager.setCookie('auth_access_token', accessToken, 1); 
    CookieManager.setCookie('auth_refresh_token', refreshToken, 30);
    
    console.log(' Cookies after setting:', document.cookie);
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
        await this.http.request<{ message: string }>('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.warn('Logout request failed, clearing local tokens:', error);
      }
    }
    
    this.clearTokens();
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(): Promise<User> {
    console.log('getCurrentUser called, accessToken:', !!this.accessToken);
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
    return this.http.request<Session[]>('/api/auth/sessions', {}, this.accessToken);
  }

  async refreshTokens(): Promise<AuthResponse> {
    const refreshToken = this.refreshToken || CookieManager.getCookie('auth_refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');

    const result = await this.http.request<AuthResponse>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    
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
