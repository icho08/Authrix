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

// Create transports array - only console for serverless environments
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat
  })
];

// Only add file transports if not in serverless environment (Vercel)
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  transports.push(
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
  );
}

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports
});

export const logger = {
  info: (message: any, meta?: any) => winstonLogger.info(message, meta),
  error: (message: any, meta?: any) => winstonLogger.error(message, meta),
  warn: (message: any, meta?: any) => winstonLogger.warn(message, meta),
  debug: (message: any, meta?: any) => winstonLogger.debug(message, meta),
  success: (message: any, meta?: any) => winstonLogger.info(message, meta) 
};
