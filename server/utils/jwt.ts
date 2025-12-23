import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { getAppById } from './AppUtils.js';
import { parseDeviceInfo } from './deviceInfo.js';

interface JWTPayload {
  userId: string;
  email: string;
  applicationId: string;
  isVerified: boolean;
}

export const signAccessToken = async (payload: JWTPayload): Promise<string> => {
  const app = await getAppById(payload.applicationId);
  
  if (!app) {
    throw new Error('Application not found');
  }
  
  return jwt.sign(payload, app.secretKey, { expiresIn: '15m' });
};

export const signRefreshToken = async (userId: string, applicationId: string, userAgent?: string, ipAddress?: string): Promise<string> => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  let deviceInfo = null;
  if (userAgent && ipAddress) {
    deviceInfo = parseDeviceInfo(userAgent, ipAddress);
  }
  
  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      deviceName: deviceInfo?.deviceName,
      browser: deviceInfo?.browser,
      os: deviceInfo?.os,
      deviceType: deviceInfo?.deviceType,
      location: deviceInfo?.location,
      ipAddress: deviceInfo?.ipAddress,
      expiresAt
    }
  });
  
  return refreshToken;
};

export const verifyAccessToken = async (token: string, applicationId: string): Promise<JWTPayload | null> => {
  try {
    const app = await getAppById(applicationId);
    
    if (!app) {
      return null;
    }
    
    const payload = jwt.verify(token, app.secretKey) as JWTPayload;
    
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: payload.userId,
        isActive: true,
        expiresAt: { gt: new Date() }
      }
    });
    
    if (!activeSession) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (refreshToken: string, applicationId: string): Promise<JWTPayload | null> => {
  try {
    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        isActive: true,
        expiresAt: {
          gt: new Date()
        },
        user: {
          applicationId
        }
      },
      include: {
        user: true
      }
    });
    
    if (!session) {
      return null;
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    });
    
    return {
      userId: session.user.id,
      email: session.user.email,
      applicationId: session.user.applicationId,
      isVerified: session.user.isVerified
    };
  } catch {
    return null;
  }
};

export const refreshTokenRotation = async (oldRefreshToken: string): Promise<string> => {
  const newRefreshToken = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await prisma.session.update({
    where: { refreshToken: oldRefreshToken },
    data: { 
      refreshToken: newRefreshToken,
      expiresAt,
      lastUsedAt: new Date()
    }
  });
  
  return newRefreshToken;
};

export const revokeSession = async (refreshToken: string): Promise<void> => {
  await prisma.session.update({
    where: { refreshToken },
    data: { isActive: false }
  });
};

export const revokeAllUserSessions = async (userId: string): Promise<void> => {
  await prisma.session.updateMany({
    where: { userId },
    data: { isActive: false }
  });
};

export const revokeOtherSessions = async (userId: string, currentRefreshToken: string): Promise<void> => {
  // Delete other sessions entirely (this invalidates their refresh tokens)
  await prisma.session.deleteMany({
    where: { 
      userId,
      refreshToken: { not: currentRefreshToken }
    }
  });
};
