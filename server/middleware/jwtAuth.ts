import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { logger } from '../config/logger.js';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const applicationId = req.application?.id;
  
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }
  
  if (!applicationId) {
    return res.status(401).json({ error: "Application not found" });
  }
  
  const payload = await verifyAccessToken(token, applicationId);
  
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  
  req.user = payload;
  next();
};

