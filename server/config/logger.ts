import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: `;
    
    if (typeof message === 'object') {
      log += JSON.stringify(message, null, 2);
    } else {
      log += message;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    }),
    
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: logFormat
    }),
    
    // Error-only logs
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m', 
      maxFiles: '30d',
      format: logFormat
    })
  ]
});

export const logger = {
  info: (message: any) => winstonLogger.info(message),
  error: (message: any) => winstonLogger.error(message),
  warn: (message: any) => winstonLogger.warn(message),
  debug: (message: any) => winstonLogger.debug(message),
  success: (message: any) => winstonLogger.info(message) // Map success to info
};
