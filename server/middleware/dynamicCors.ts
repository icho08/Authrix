import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';

export const dynamicCors = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const origin = req.headers.origin;

  let allowedOrigins: string[] = [
    ""
  ];

  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001');
  }

  // Only check for configured domains if API key is provided AND origin is NOT localhost
  if (apiKey && origin && !origin.match(/^http:\/\/localhost:\d+$/)) {
    try {
      const application = await prisma.application.findUnique({
        where: { apiKey },
        select: { allowedDomains: true }
      });

      if (application) {
        if (application.allowedDomains.length === 0) {
          // No domains configured - return error
          return res.status(403).json({
            error: "No allowed domains configured",
            message: "Please add allowed domains in your application dashboard before making requests"
          });
        }
        allowedOrigins = [...allowedOrigins, ...application.allowedDomains];
      }
    } catch (error) {
      logger.error(`Error fetching application for CORS: ${error}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      // Allow localhost in development
      if (origin.match(/^http:\/\/localhost:\d+$/)) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject the request
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key", "X-Requested-With", "X-Refresh-Token"]
  };

  cors(corsOptions)(req, res, next);
};
