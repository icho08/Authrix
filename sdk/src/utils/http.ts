import { createRateLimiter } from './rateLimiter';
import { withRetry } from './retry';

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private onTokenExpired?: () => Promise<string>;
  private rateLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60000 });

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  setTokenRefreshCallback(callback: () => Promise<string>) {
    this.onTokenExpired = callback;
  }

  private getHeaders(accessToken?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return headers;
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}, accessToken?: string): Promise<T> {
    if (!this.rateLimiter.canMakeRequest()) {
      const retryAfter = this.rateLimiter.getRetryAfter();
      throw new Error(`Rate limit exceeded. Retry after ${retryAfter}ms`);
    }
    return withRetry(async () => {
      
      let response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(accessToken),
          ...options.headers,
        },
      });

      if (response.status === 401 && this.onTokenExpired && accessToken) {
        const newToken = await this.onTokenExpired();
        
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...this.getHeaders(newToken),
            ...options.headers,
          },
        });
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
        throw new Error(`HTTP ${response.status}: ${error.message || 'Request failed'}`);
      }

      return response.json() as Promise<T>;
    }, { maxRetries: 3, baseDelay: 1000 });
  }
}
