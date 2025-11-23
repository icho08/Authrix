type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  level: LogLevel;
  prefix: string;
  enabled: boolean;
}

class Logger {
  private config: LoggerConfig;
  private levels = { debug: 0, info: 1, warn: 2, error: 3 };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: 'info',
      prefix: '[AuthrixSDK]',
      enabled: true,
      ...config
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && this.levels[level] >= this.levels[this.config.level];
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug')) console.debug(`${this.config.prefix} ${message}`, ...args);
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info')) console.info(`${this.config.prefix} ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn')) console.warn(`${this.config.prefix} ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog('error')) console.error(`${this.config.prefix} ${message}`, ...args);
  }
}

export const logger = new Logger();
export const createLogger = (config: Partial<LoggerConfig>) => new Logger(config);
