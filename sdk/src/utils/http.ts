export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private onTokenExpired?: () => Promise<string>;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  setTokenRefreshCallback(callback: () => Promise<string>) {
    this.onTokenExpired = callback;
  }

  private getHeaders(accessToken?: string) {
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
    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(accessToken),
        ...options.headers,
      },
    });

    if (response.status === 401 && this.onTokenExpired && accessToken) {
      try {
        const newToken = await this.onTokenExpired();
        
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...this.getHeaders(newToken),
            ...options.headers,
          },
        });
      } catch {
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
