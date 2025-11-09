import bcrypt from "bcryptjs" ; 
import prisma from "../../config/prisma";
import { logger } from "../../config/logger";
import { doesUserExist } from "../../utils/userUtils";
import 'dotenv/config'; 
export const createUser = async (email: string, password: string, applicationId: string , isVerified: boolean) => {
  try {
    if (await doesUserExist(email, applicationId)) {
      return { error: "User already exists" };
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
    
    return { id: user.id, email: user.email , isVerified: user.isVerified , applicationId: user.applicationId };
  } catch (err: any) {
    logger.error(err);
    return null;
  }
};
