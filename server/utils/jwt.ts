import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma';
import { getAppById } from './AppUtils';

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

export const signRefreshToken = async (userId: string, applicationId: string): Promise<string> => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      refreshToken,
      refreshTokenExpiry: expiry
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
    
    return jwt.verify(token, app.secretKey) as JWTPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = async (refreshToken: string, applicationId: string): Promise<JWTPayload | null> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken,
        applicationId,
        refreshTokenExpiry: {
          gt: new Date()  
        }
      }
    });
    
    if (!user) {
      return null;
    }
    
    return {
      userId: user.id,
      email: user.email,
      applicationId: user.applicationId,
      isVerified: user.isVerified
    };
  } catch {
    return null;
  }
};

export const revokeRefreshToken = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { 
      refreshToken: null,
      refreshTokenExpiry: null
    }
  });
};
