import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyStaffToken } from '../utils/jwt.js';
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';

export const authenticateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Staff token required" });
    }
    
    // Using verifyStaffToken for internal staff tokens
    const payload = await verifyStaffToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: "Invalid staff token" });
    }
    
    const staff = await prisma.staff.findUnique({
      where: { id: payload.userId }
    });
    
    if (!staff) {
      return res.status(401).json({ error: "Staff member not found" });
    }
    
    (req as any).staff = staff;
    next();
  } catch (error) {
    logger.error("Staff auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
