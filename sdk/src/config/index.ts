import { ValidationError } from '../errors';
import type { AuthConfig } from '../types';

export class Config {
  public readonly apiKey: string;
  public readonly baseUrl: string;
  public readonly timeout: number;
  public readonly retries: number;

  constructor(config: AuthConfig) {
    this.validateConfig(config);
    
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || this.getDefaultBaseUrl();
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 3;
  }

  private validateConfig(config: AuthConfig) {
    if (!config.apiKey || typeof config.apiKey !== 'string') {
      throw new ValidationError('API key is required and must be a string');
    }
    
    if (config.baseUrl && !this.isValidUrl(config.baseUrl)) {
      throw new ValidationError('Base URL must be a valid URL');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getDefaultBaseUrl(): string {
    if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
      return (globalThis as any).window.location.origin;
    }
    return '';
  }
}
