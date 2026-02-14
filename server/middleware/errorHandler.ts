import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../config/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req as any).requestId;

  logger.error({
    error: err.message,
    stack: err.stack,
    requestId,
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        requestId
      }
    });
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    // Cast error to any to access prisma-specific properties
    const prismaError = err as any;
    return res.status(400).json({
      error: {
        code: prismaError.code,
        message: 'Database operation failed: ' + prismaError.message,
        meta: prismaError.meta,
        requestId
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token provided',
        requestId
      }
    });
  }

  // Default server error
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      requestId
    }
  });
};
