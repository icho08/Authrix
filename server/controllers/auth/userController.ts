import { Request, Response, NextFunction } from 'express';
import { changeUserPassword, createUser, loginUser, resetUserPassword } from '../../models/auth/User.js';
import { verifyRefreshToken, signAccessToken, refreshTokenRotation, revokeSession, revokeAllUserSessions, revokeOtherSessions } from '../../utils/jwt.js';
import { logger } from '../../config/logger.js';
import { ValidationError } from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';
import { SendPasswordResetEmail } from '../../utils/emailService.js';
import { USER_LIMITS } from '../../models/admin/Application.js';

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

    // Check user limits based on developer's plan
    const app = (req as any).application;
    const developer = await prisma.user.findUnique({
      where: { id: app.userId },
      select: { plan: true }
    });

    if (!developer) {
      throw new ValidationError("Developer not found");
    }

    const apps = await prisma.application.findMany({
      where: { userId: app.userId },
      select: { id: true }
    });

    const appIds = apps.map((a: any) => a.id);
    const totalUserCount = await prisma.user.count({
      where: { applicationId: { in: appIds } }
    });

    const limit = USER_LIMITS[developer.plan as keyof typeof USER_LIMITS] || 1000;

    if (totalUserCount >= limit) {
      throw new ValidationError(`This application has reached its user limit of ${limit.toLocaleString()} users for the ${developer.plan} plan.`);
    }
    
    const result = await createUser({
      email,
      password,
      username,
      applicationId,
      isVerified,
      userAgent,
      ipAddress
    });
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
    
    const result = await loginUser({
      email,
      password,
      applicationId,
      userAgent,
      ipAddress
    });
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
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({
    id: user.userId,
    email: user.email,
    username : user.username, 
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
    const refreshToken = req.headers['x-refresh-token'] as string;
    const user = (req as any).user;
    
    if (!refreshToken) {
      throw new ValidationError("Refresh token required in X-Refresh-Token header");
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
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invalid Verification Link</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 500px; background: white; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
            .icon { width: 64px; height: 64px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
            h1 { color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; }
            p { color: #6b7280; margin: 0; font-size: 16px; line-height: 1.5; }
            .btn { display: inline-block; background: #ef4444; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1>Invalid Verification Link</h1>
            <p>The verification link is invalid or missing. Please check your email for the correct link or request a new verification email.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || decoded.type !== 'email_verification') {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invalid Token</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 500px; background: white; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
            .icon { width: 64px; height: 64px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
            h1 { color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; }
            p { color: #6b7280; margin: 0; font-size: 16px; line-height: 1.5; }
            .btn { display: inline-block; background: #ef4444; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">⚠️</div>
            <h1>Invalid Token Type</h1>
            <p>This token is not for email verification. Please use the correct verification link from your email.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    const application = await prisma.application.findUnique({
      where: { id: decoded.applicationId }
    });
    
    if (!application) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Not Found</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 500px; background: white; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
            .icon { width: 64px; height: 64px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
            h1 { color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; }
            p { color: #6b7280; margin: 0; font-size: 16px; line-height: 1.5; }
            .btn { display: inline-block; background: #ef4444; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🔍</div>
            <h1>Application Not Found</h1>
            <p>The application associated with this verification link was not found. Please contact support for assistance.</p>
          </div>
        </body>
        </html>
      `);
    }
    
    const verified = jwt.verify(token, application.secretKey) as any;
    
    const user = await prisma.user.findUnique({
      where: { 
        id: verified.userId,
        applicationId: verified.applicationId
      }
    });
    
    if (!user) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>User Not Found</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 500px; background: white; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
            .icon { width: 64px; height: 64px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
            h1 { color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; }
            p { color: #6b7280; margin: 0; font-size: 16px; line-height: 1.5; }
            .btn { display: inline-block; background: #ef4444; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">👤</div>
            <h1>User Not Found</h1>
            <p>The user account associated with this verification link was not found. Please try registering again or contact support.</p>
            <a href="/" class="btn">Go to Homepage</a>
          </div>
        </body>
        </html>
      `);
    }
    
    if (user.isVerified) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Already Verified</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { max-width: 500px; background: white; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
            .icon { width: 64px; height: 64px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
            h1 { color: #1f2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; }
            p { color: #6b7280; margin: 0; font-size: 16px; line-height: 1.5; }
            .btn { display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>Already Verified!</h1>
            <p>Your email address is already verified. You can now log in to your account and start using our services.</p>
            <a href="/login" class="btn">Go to Login</a>
          </div>
        </body>
        </html>
      `);
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpiry: null
      }
    });
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified Successfully!</title>
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #10b981 0%, #059669 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .container { max-width: 500px; background: white; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
          .icon { width: 80px; height: 80px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
          h1 { color: #1f2937; margin: 0 0 16px 0; font-size: 28px; font-weight: 600; }
          p { color: #6b7280; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; }
          .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 24px 0; }
          .btn { display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin-top: 8px; transition: all 0.2s; }
          .btn:hover { background: #059669; transform: translateY(-1px); }
          .confetti { animation: confetti 2s ease-in-out infinite; }
          @keyframes confetti { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(5deg); } 75% { transform: rotate(-5deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon confetti">🎉</div>
          <h1>Email Verified Successfully!</h1>
          <p>Congratulations! Your email address has been verified and your account is now active.</p>
          
          <div class="success-box">
            <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 500;">
              ✅ Account activated • ✅ Email verified • ✅ Ready to use
            </p>
          </div>
          
          <p style="color: #374151; font-size: 14px; margin: 16px 0;">
            You can now log in to your account and start using all the features available to you.
          </p>
          
          <a href="/login" class="btn">Continue to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (error : any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).send(`
        <html><body>
          <h2>Invalid or Expired Token</h2>
          <p>The verification link is invalid or has expired.</p>
        </body></html>
      `);
    }
    
    res.status(500).send(`
      <html><body>
        <h2>Verification Error</h2>
        <p>An error occurred during verification. Please try again.</p>
      </body></html>
    `);
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
    
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry 
    
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });
    
    await SendPasswordResetEmail(
    {  to : email , 
      token : resetToken,
      appName : user.application.name,}
    );
    
    res.status(200).json({ message: "If the email exists, a reset code has been sent" });
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
    
    const result = await resetUserPassword({
      token,
      newPassword,
      applicationId
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req : Request , res:Response , next:NextFunction) =>{ 
  try{
    const {oldPassword , newPassword } = req.body; 
    const applicationId = req.application?.id ; 
    const userId = req.user?.userId;
    
    if(!oldPassword || !newPassword ){ 
      throw new ValidationError("Old password and new password are required")
    }
    if(oldPassword === newPassword){ 
      throw new ValidationError("New password must be different from old password")
    }
    
    if(!userId || !applicationId) {
      throw new ValidationError("User authentication required")
    }
    
    const result = await changeUserPassword({
      oldPassword,
      newPassword,
      userId,
      applicationId
    }); 
    if(result instanceof ValidationError){
      throw result;
    }

    res.json(result);
  }catch(err){ 
    next(err);
  }
}


export const deleteUserAccount = async (req : Request , res : Response)=> { 
  try { 
    const user = req.user ; 
    const applicationId = req.application?.id;
    if(!user || !applicationId) { 
      return res.status(401).json({ error: "Unauthorized" }); 
    } 
    await prisma.user.deleteMany({
      where: { id: user.userId, applicationId } 
    });
    await prisma.application.deleteMany({
      where: { id: applicationId , userId : user.userId } 
    });
    await prisma.session.deleteMany({ 
      where: { userId: user.userId }
    });

    return res.status(200).json({ message: "User account and associated application deleted successfully" });
  }catch(err){ 
    
    logger.error(err); 
    return res.status(500).json({ error: "Failed to delete user account" }); 

  }
}

export const updateProfile = async (req : Request , res : Response)=> { 
  try { 
    const user = req.user ; 
    const applicationId = req.application?.id;
    if(!user || !applicationId) { 
      return res.status(401).json({ error: "Unauthorized" }); 
    } 
    const result = await prisma.user.update({
      where: { id: user.userId, applicationId } ,
      data : { 
        username : req.body.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        applicationId: true,
      }
    });
    return res.status(200).json(result); 
  }catch(err){ 
    logger.error(err); 
    return res.status(500).json({ error: "Failed to update user profile" }); 
  }
}