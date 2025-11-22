interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryableStatuses: number[];
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  retryableStatuses: [408, 429, 500, 502, 503, 504]
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: Error;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === finalConfig.maxRetries) break;
      
      // Check if error is retryable
      const isRetryable = error instanceof Error && 
        error.message.includes('HTTP') &&
        finalConfig.retryableStatuses.some(status => 
          error.message.includes(status.toString())
        );
      
      if (!isRetryable) break;
      
      // Exponential backoff with jitter
      const delay = Math.min(
        finalConfig.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        finalConfig.maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
