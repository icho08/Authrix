import bcrypt from "bcryptjs" ; 
import prisma from "../../config/prisma";
import { logger } from "../../config/logger";
import { doesUserExist } from "../../utils/userUtils";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import 'dotenv/config'; 
import { IsEmail } from "../../utils/Email";
export const createUser = async (email: string, password: string, applicationId: string, isVerified: boolean, userAgent?: string, ipAddress?: string) => {
  try {
    if (await doesUserExist(email, applicationId)) {
      return { error: "User already exists" };
    }
     if(!IsEmail(email)){ 
      return {error : "Please enter a valid email"}
     }

    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10 ;
    const hashedPassword = await bcrypt.hash(password , SALT_ROUNDS);
  
    const user = await prisma.user.create({
      data: {
        email : email, 
       password: hashedPassword,
       applicationId: applicationId , 
       isVerified : isVerified , 
      }
    });
    
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
  } catch (err: any) {
    logger.error(err);
    return null;
  }
};

export const loginUser = async (email: string, password: string, applicationId: string, userAgent?: string, ipAddress?: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email_applicationId: { email, applicationId } },
    });
    
    if (!user) {
      return { error: "User not found" };
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { error: "Invalid password" };
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
  } catch (err: any) {
    logger.error(err);
    return null;
  } }