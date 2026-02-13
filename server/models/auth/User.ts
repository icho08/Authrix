import bcrypt from "bcryptjs" ; 
import prisma from "../../config/prisma.js";
import { logger } from "../../config/logger.js";
import { doesUserExist } from "../../utils/userUtils.js";
import { revokeAllUserSessions, signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import 'dotenv/config'; 
import { IsEmail } from "../../utils/Email.js";
import { ConflictError , ValidationError } from "../../utils/errors.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendLoginAlert, SendWelcomeEmail } from "../../utils/emailService.js";
import { CreateUserParams, LoginUserParams, ChangeUserPasswordParams, ResetUserPasswordParams } from "./User.types.js";

export const createUser = async (params: CreateUserParams) => {
  const { email, password, username, applicationId, isVerified, userAgent, ipAddress } = params;
  
  if (await doesUserExist(email, applicationId)) {
    throw new ConflictError("User already exists");
  }
  
  if(!IsEmail(email)){ 
    throw new ValidationError("Please enter a valid email");
  }

  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10 ;
  const hashedPassword = await bcrypt.hash(password , SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email : email, 
      username: username,
     password: hashedPassword,
     applicationId: applicationId , 
     isVerified : isVerified,
     verificationToken: null,
     verificationExpiry: null
    }
  });

  let verificationToken = null;
  if (!isVerified) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });
    
    if (!application) {
      throw new ValidationError("Invalid application");
    }
    
    verificationToken = jwt.sign(
      { userId: user.id, applicationId, type: 'email_verification' },
      application.secretKey,
      { expiresIn: '24h' }
    );
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  }
  SendWelcomeEmail(email); 
  const application = await prisma.application.findUnique({
    where: { id: applicationId }
  });
   
  if (!isVerified && verificationToken && application) {
    try {
      await sendVerificationEmail(
        email, 
        verificationToken, 
        application.name,
        `noreply@${application.name.toLowerCase().replace(/\s+/g, '')}.com`
      );
    } catch (error) {
      logger.error({
        message: "Error sending verification email",
        error: error
      });
    }
  }
  
  if (!isVerified) {
    return {
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.isVerified,
        applicationId: user.applicationId
      },
      message: "Please check your email to verify your account"
    };
  }
  
  const accessToken = await signAccessToken({
    userId: user.id,
    email: user.email,
    applicationId: user.applicationId,
    isVerified: user.isVerified, 
    username : user.username , 
  });
  
  const refreshToken = await signRefreshToken(user.id, user.applicationId, userAgent, ipAddress);
  
  return { 
    user: {
      id: user.id, 
      email: user.email, 
      isVerified: user.isVerified, 
      applicationId: user.applicationId
    },
    accessToken,
    refreshToken
  };
};

export const loginUser = async (params: LoginUserParams) => {
  const { email, password, applicationId, userAgent, ipAddress } = params;
  
  const user = await prisma.user.findUnique({
    where: { email_applicationId: { email, applicationId } },
    include: { application: true }
  });
  
  if (!user) {
    throw new ValidationError("Invalid email or password");
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new ValidationError("Invalid email or password");
  }

  if (!user.isVerified) {
    // Check if verification token exists and is valid
    const needsNewToken = !user.verificationToken || 
                         !user.verificationExpiry || 
                         user.verificationExpiry < new Date();
    
    if (needsNewToken) {
      // Generate new verification token
      const application = await prisma.application.findUnique({
        where: { id: user.applicationId }
      });
      
      if (!application) {
        throw new ValidationError("Invalid application");
      }
      
      const verificationToken = jwt.sign(
        { userId: user.id, applicationId: user.applicationId, type: 'email_verification' },
        application.secretKey,
        { expiresIn: '24h' }
      );
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 
      
      await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken, verificationExpiry }
      });
      
      // Send new verification email
      try {
        await sendVerificationEmail(
          email,
          verificationToken,
          user.application.name,
          `noreply@${user.application.name.toLowerCase().replace(/\s+/g, '')}.com`
        );
      } catch (error ) { 
        logger.error({message : "Failed to send verification email" , 
          error
        });
      }
      
      throw new ValidationError("Please verify your email. A new verification link has been sent.");
    } else {
      throw new ValidationError("Please verify your email. Check your inbox for the verification link.");
    }
  }

  // Send login alert for security
  if (userAgent && ipAddress) {
    try {
      const { parseDeviceInfo } = await import('../../utils/deviceInfo');
      const deviceInfo = parseDeviceInfo(userAgent, ipAddress);
      
      await sendLoginAlert(
        {
          to : email,
         deviceInfo : deviceInfo.deviceName, 
        ipAddress : deviceInfo.ipAddress,
        location : deviceInfo.location, 
        timestamp : new Date() 

        }
       );
    } catch (error) {
      logger.error({
        message: "Error sending login alert",
        error: error
      });
    }
  }

  return { 
    user: {
      id: user.id , 
      email: user.email, 
      isVerified: user.isVerified, 
      applicationId: user.applicationId 
    },
    accessToken: await signAccessToken({
      userId: user.id,
      email: user.email,
      applicationId: user.applicationId,
      isVerified: user.isVerified,
      username : user.username

    }),
    refreshToken: await signRefreshToken(user.id, user.applicationId, userAgent, ipAddress)
  };
};
export const resetUserPassword = async (params: ResetUserPasswordParams) => {
  const { token, newPassword, applicationId } = params;
  
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      applicationId,
      resetTokenExpiry: { gt: new Date() }
    }
  });
  
  if (!user) {
    throw new ValidationError("Invalid or expired reset token");
  }
  
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  });
  
  return { message: "Password reset successfully" };
};

export const changeUserPassword = async (params: ChangeUserPasswordParams) => {
  const { oldPassword, newPassword, userId, applicationId } = params;
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new ValidationError("User not found");
  }

  if (user.applicationId !== applicationId) {
    throw new ValidationError("User not found in this application");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
  if (!isPasswordValid) {
    throw new ValidationError("Invalid old password");
  }

  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword
    }
  });
await revokeAllUserSessions(userId);
  
  return { message: "Password changed successfully" };
}

