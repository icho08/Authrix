import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';

export const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  // logger.info("Api Key " + apiKey);
  
  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }
  
  const app = await prisma.application.findUnique({
    where: { apiKey }
  });
// logger.info(app); 
  
  if (!app) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  
  (req as any).application = app;
  next();
};
