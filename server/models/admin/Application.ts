import { nanoid } from "nanoid";
import crypto from "crypto";
import { logger } from "../../config/logger";
import prisma from "../../config/prisma";
export const createApplication = async (name : string , id : string) => {
  try {
    if (!name) {
      return { error: "name is required" };
    }
    const apiKey = `ak_${nanoid()}`;
    const secretKey = crypto.randomBytes(48).toString("base64");
    const app = await prisma.application.create({
      data: { name, apiKey, secretKey , userId : id },
    });
    if (!app) {
      return { error: "something went wrong" };
    }
    return { apiKey, secretKey, appId: app.id , name : app.name };
  } catch (err: any) {
    logger.error(err);
    return {error : "Failed to create application"}
  }
};


export const updateApplication = async (payload: {name : string , requireEmailVerification : boolean} , id : string) => {
  try {
    if (!payload.name) {
      return { error: "name is required" };
    }
    const app = await prisma.application.update({
      where : { 
        id : id
      },
      data : {
        name : payload.name  , 
        requireEmailVerification : payload.requireEmailVerification 
      }
    });  
    if (!app) {
      return { error: "something went wrong" };
    } 
    return { name : app.name , requireEmailVerification : app.requireEmailVerification} 
  }catch(err : any){ 
      logger.error(err); 
      return {error : "Failed to update application"}
  }}; 

export const updateApplicationSettings = async (
 appId : string , 
  userId: string, 
  settings: { name?: string; requireEmailVerification?: boolean }
) => {
  try {
  
    const app = await prisma.application.findFirst({
      where: { id: appId,  userId : userId}
    });
    
    if (!app) {
      return { error: "App not found or unauthorized" };
    }
    
    const updatedApp = await prisma.application.update({
      where: { id: appId , userId : userId },
      data: settings,
      select: { id: true, name: true, requireEmailVerification: true }
    });
    
    return updatedApp;
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to update application" };
  }
};
