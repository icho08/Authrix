import e, { Request, Response, NextFunction } from 'express';
import { createUser, loginUser } from '../../models/auth/User';
import { verifyRefreshToken, signAccessToken, refreshTokenRotation, revokeSession, revokeAllUserSessions, revokeOtherSessions } from '../../utils/jwt';
import { logger } from '../../config/logger';
import { ValidationError } from '../../utils/errors';
import prisma from '../../config/prisma';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const applicationId = (req as any).application.id;
    const isVerified = !(req as any).application.requireEmailVerification;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }
    
    const result = await createUser(email, password, applicationId, isVerified, userAgent, ipAddress);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req : Request , res : Response) => { 
  const { email , password } = req.body;
  const applicationId = (req as any).application.id;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;
  
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  
  const result = await loginUser(email, password, applicationId, userAgent, ipAddress); 
  if (!result) {
    return res.status(500).json({ error: "Failed to create user" });
  }
  
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json(result);
}

export const refreshToken = async (req: Request, res: Response) => {
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  console.log('X-Refresh-Token header:', req.headers['x-refresh-token']);
  
  const refreshToken = req.headers.authorization?.replace('Bearer ', '') || 
                      req.headers['x-refresh-token'] as string;
  const applicationId = (req as any).application.id;
  
logger.debug("Refresh Token " + refreshToken);  
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required in Authorization header" });
  }
  
  const payload = await verifyRefreshToken(refreshToken, applicationId);
  
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
  
  const newAccessToken = await signAccessToken(payload);
  const newRefreshToken = await refreshTokenRotation(refreshToken);
  
  res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
};

export const getProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  
  res.status(200).json({
    id: user.userId,
    email: user.email,
    isVerified: user.isVerified,
    applicationId: user.applicationId
  });
};


export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.headers.authorization?.replace('Bearer ', '') || 
                      req.headers['x-refresh-token'] as string;
  
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required in Authorization header" });
  }
  
  await revokeSession(refreshToken);
  res.status(200).json({ message: "Logged out successfully" });
};

export const logoutAll = async (req: Request, res: Response) => {
  const user = (req as any).user;
  
  await revokeAllUserSessions(user.userId);
  res.status(200).json({ message: "Logged out from all devices" });
};

export const logoutOthers = async (req: Request, res: Response) => {
  const refreshToken = req.headers.authorization?.replace('Bearer ', '') || 
                      req.headers['x-refresh-token'] as string;
  const user = (req as any).user;
  
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required in Authorization header" });
  }
  
  await revokeOtherSessions(user.userId, refreshToken);
  res.status(200).json({ message: "Logged out from other devices" });
};

export const getSessions = async (req: Request, res: Response) => {
  const user = (req as any).user;
  
  const sessions = await prisma.session.findMany({
    where: {
      userId: user.userId,
      isActive: true,
      expiresAt: {
        gt: new Date()
      }
    },
    select: {
      id: true,
      deviceName: true,
      browser: true,
      os: true,
      deviceType: true,
      location: true,
      ipAddress: true,
      createdAt: true,
      lastUsedAt: true
    },
    orderBy: {
      lastUsedAt: 'desc'
    }
  });
  
  res.status(200).json({ sessions });
};
