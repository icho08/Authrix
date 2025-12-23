import crypto from "crypto";
import { nanoid } from "nanoid";
import { logger } from "../../config/logger.js";
import prisma from "../../config/prisma.js";

export const createApplication = async (name : string , id : string) => {
  try {
    if (!name) {
      return { error: "name is required" };
    }

    // Only allow one application per user
    const existing = await prisma.application.findFirst({
      where: { userId: id }
    });

    if (existing) {
      return { error: "You already have an application" };
    }

    const apiKey = `ak_${nanoid()}`;
    const secretKey = crypto.randomBytes(48).toString("base64");
    const app = await prisma.application.create({
      data: { name, apiKey, secretKey , userId : id },
    });
    if (!app) {
      return { error: "something went wrong" };
    }
    return { apiKey, secretKey, appId: app.id , name : app.name, requireEmailVerification: app.requireEmailVerification };
  } catch (err: any) {
    logger.error(err);
    return {error : "Failed to create application"}
  }
};

export const getUserApplication = async (userId: string) => {
  try {
    const app = await prisma.application.findFirst({
      where: { userId },
      select: {
        id: true,
        name: true,
        apiKey: true,
        secretKey: true,
        requireEmailVerification: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return app;
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to fetch application" };
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
logger.info(app);
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

export const deleteApp = async(appId : string , userId : string)=>{ 
  try { 
    const app = await prisma.application.findFirst({ 
      where : { 
        id : appId , 
        userId : userId
      }, 
      select : { 
        id : true
      }
    }); 
    if(!app){ 
      return {error : "App not found or unauthorized"} 
    } 

    await prisma.session.deleteMany({
      where: {
        user: {
          applicationId: app.id
        }
      }
    });

    await prisma.user.deleteMany({
      where: {
        applicationId: app.id
      }
    });

    await prisma.application.delete({ 
      where : { 
        id : app.id 
      } 
    }); 
    
    return {message : "App and all associated data deleted successfully"}
  }catch(err:any){ 
    logger.error(err); 
    return {error : "Failed to delete app"}
  }
}

export const getApplicationUsers = async (userId: string, appId: string) => { 
  try { 
   const app = await prisma.application.findFirst({ 
      where : { 
        id : appId , 
        userId : userId
      },
      select : { 
        id : true
      }
    });
    if(!app){
      return {error : "App not found or unauthorized"}
    }
    
    const users = await prisma.user.findMany({
      where: {
        applicationId: app.id
      },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });
      
    return users;

  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to fetch app users" };
  }
}