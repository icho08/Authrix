import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyStaffToken } from '../utils/jwt.js';
import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';

export const authenticateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    
    // Verify standard access token
    const payload = await verifyAccessToken(token);
    
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Check if the user is a staff member
    const staff = await prisma.staff.findUnique({
      where: { userId: payload.userId },
      include: { user: true }
    });
    
    if (!staff) {
      // User is not staff, return 404 as requested to hide the route
      return res.status(404).json({ error: "Resource not found" });
    }
    
    (req as any).staff = staff;
    (req as any).user = staff.user; // Also attach user info
    next();
  } catch (error) {
    logger.error("Staff auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
