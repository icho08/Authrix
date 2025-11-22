interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: number[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => time > windowStart);
    
    if (this.requests.length >= this.config.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getRetryAfter(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, oldestRequest + this.config.windowMs - Date.now());
  }
}

export const createRateLimiter = (config: RateLimitConfig) => new RateLimiter(config);
