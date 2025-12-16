import { createRateLimiter } from './rateLimiter';
import { withRetry } from './retry';
import { logger } from './logger';

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private onTokenExpired?: () => Promise<string>;
  private rateLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60000 });

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    logger.info('HttpClient initialized', { baseUrl });
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
      logger.warn('Rate limit exceeded', { endpoint, retryAfter });
      throw new Error(`Rate limit exceeded. Retry after ${retryAfter}ms`);
    }
    return withRetry(async () => {
      logger.debug('Making request', { endpoint, hasToken: !!accessToken });
      
      let response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(accessToken),
          ...options.headers,
        },
      });

      if (response.status === 401 && this.onTokenExpired && accessToken) {
        logger.info('Token expired, refreshing', { endpoint });
        const newToken = await this.onTokenExpired();
        logger.debug('Token refreshed, retrying request');
        
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...this.getHeaders(newToken),
            ...options.headers,
          },
        });
      }

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: 'Request failed' })) as { message?: string; error?: string };
        const message = error.error || error.message || 'Request failed';
        logger.error('Request failed', { endpoint, status: response.status, error: message });
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      logger.debug('Request successful', { endpoint, status: response.status });
      return response.json() as Promise<T>;
    }, { maxRetries: 3, baseDelay: 1000 });
  }
}
