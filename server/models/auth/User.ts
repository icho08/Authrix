import bcrypt from "bcryptjs" ; 
import prisma from "../../config/prisma";
import { logger } from "../../config/logger";
import { doesUserExist } from "../../utils/userUtils";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import 'dotenv/config'; 
import { IsEmail } from "../../utils/Email";
import { ConflictError , ValidationError } from "../../utils/errors";
import crypto from "crypto"; 
import { sendVerificationEmail, sendLoginAlert, SendWelcomeEmail } from "../../utils/emailService";
export const createUser = async (email: string, password: string, applicationId: string, isVerified: boolean, userAgent?: string, ipAddress?: string) => {
  if (await doesUserExist(email, applicationId)) {
    throw new ConflictError("User already exists");
  }
  
  if(!IsEmail(email)){ 
    throw new ValidationError("Please enter a valid email");
  }

  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10 ;
  const hashedPassword = await bcrypt.hash(password , SALT_ROUNDS);

  let verificationToken = null;
  let verificationExpiry = null;
  
  if (!isVerified) {
    verificationToken = crypto.randomBytes(32).toString('hex');
    verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  const user = await prisma.user.create({
    data: {
      email : email, 
     password: hashedPassword,
     applicationId: applicationId , 
     isVerified : isVerified,
     verificationToken,
     verificationExpiry
    }
  });
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
    isVerified: user.isVerified
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

export const loginUser = async (email: string, password: string, applicationId: string, userAgent?: string, ipAddress?: string) => {
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
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
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
      isVerified: user.isVerified
    }),
    refreshToken: await signRefreshToken(user.id, user.applicationId, userAgent, ipAddress)
  };
};
export const resetUserPassword = async (token: string, newPassword: string, applicationId: string) => {
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
