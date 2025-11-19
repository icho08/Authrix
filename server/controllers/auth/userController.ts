import { Request, Response, NextFunction } from 'express';
import { createUser, loginUser, resetUserPassword } from '../../models/auth/User';
import { verifyRefreshToken, signAccessToken, refreshTokenRotation, revokeSession, revokeAllUserSessions, revokeOtherSessions } from '../../utils/jwt';
import { logger } from '../../config/logger';
import { ValidationError } from '../../utils/errors';
import crypto from 'crypto';
import prisma from '../../config/prisma';
import { SendPasswordResetEmail } from '../../utils/emailService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username } = req.body;
    const applicationId = (req as any).application.id;
    const isVerified = !(req as any).application.requireEmailVerification;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    
    if (!email || !password || !username) {
      throw new ValidationError("Email, password, and username are required");
    }
    
    const result = await createUser(email, password, username, applicationId, isVerified, userAgent, ipAddress);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req : Request , res : Response, next: NextFunction) => { 
  try {
    const { email , password } = req.body;
    const applicationId = (req as any).application.id;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }
    
    const result = await loginUser(email, password, applicationId, userAgent, ipAddress);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '') || 
                        req.headers['x-refresh-token'] as string;
    const applicationId = (req as any).application.id;
    
    if (!refreshToken) {
      throw new ValidationError("Refresh token required in Authorization header");
    }
    
    const payload = await verifyRefreshToken(refreshToken, applicationId);
    
    if (!payload) {
      throw new ValidationError("Invalid or expired refresh token");
    }
    
    const newAccessToken = await signAccessToken(payload);
    const newRefreshToken = await refreshTokenRotation(refreshToken);
    
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
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


export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '') || 
                        req.headers['x-refresh-token'] as string;
    
    if (!refreshToken) {
      throw new ValidationError("Refresh token required in Authorization header");
    }
    
    await revokeSession(refreshToken);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    await revokeAllUserSessions(user.userId);
    res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    next(error);
  }
};

export const logoutOthers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '') || 
                        req.headers['x-refresh-token'] as string;
    const user = (req as any).user;
    
    if (!refreshToken) {
      throw new ValidationError("Refresh token required in Authorization header");
    }
    
    await revokeOtherSessions(user.userId, refreshToken);
    res.status(200).json({ message: "Logged out from other devices" });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const applicationId = (req as any).application.id;
    
    if (!token) {
      throw new ValidationError("Verification token is required");
    }
    
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        applicationId,
        verificationExpiry: {
          gt: new Date()
        }
      }
    });
    
    if (!user) {
      throw new ValidationError("Invalid or expired verification token");
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpiry: null
      }
    });
    
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};


export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const applicationId = (req as any).application.id;
    
    if (!email) {
      throw new ValidationError("Email is required");
    }
    
    const user = await prisma.user.findUnique({
      where: { email_applicationId: { email, applicationId } },
      include: { application: true }
    });
    
    if (!user) {
      return res.status(200).json({ message: "If the email exists, a reset link has been sent" });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); 
    
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });
    
    await SendPasswordResetEmail(
    {  to : email , 
      token : resetToken,
      appName : user.application.name,}
    );
    
    res.status(200).json({ message: "If the email exists, a reset link has been sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const applicationId = (req as any).application.id;
    
    if (!token || !newPassword) {
      throw new ValidationError("Token and new password are required");
    }
    
    const result = await resetUserPassword(token, newPassword, applicationId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
