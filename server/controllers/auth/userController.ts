import e, { Request, Response } from 'express';
import { createUser, loginUser } from '../../models/auth/User';
import { verifyRefreshToken, signAccessToken, refreshTokenRotation } from '../../utils/jwt';
import { logger } from '../../config/logger';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const applicationId = (req as any).application.id;
  const isVerified = !(req as any).application.requireEmailVerification;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;
  
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  
  const result = await createUser(email, password, applicationId, isVerified, userAgent, ipAddress);
  
  if (!result) {
    return res.status(500).json({ error: "Failed to create user" });
  }
  
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  
  res.status(201).json(result);
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
  const { refreshToken } = req.body;
  const applicationId = (req as any).application.id;
  
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
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
