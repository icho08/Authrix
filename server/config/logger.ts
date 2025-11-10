import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console logging (development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File logging (production) - rotates daily
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
  success: (message: any) => winstonLogger.info(message) 
};
