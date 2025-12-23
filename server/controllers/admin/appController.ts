import { Request, Response } from 'express';
import { createApplication, deleteApp, getApplicationUsers, getUserApplication, updateApplicationSettings } from '../../models/admin/Application.js';
import { logger } from '../../config/logger.js';
import { refreshToken } from '../auth/userController.js';
import prisma from '../../config/prisma.js';

export const createApp = async (req: Request, res: Response) => {  
 try {  
  const {name } = req.body;
  const user = req.user; 
  if(!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if(!name) {
    return res.status(400).json({ error: "name is required" }); 
  }   
  const app = await createApplication(name , user.userId); 
  if(!app || app.error) {
    return res.status(500).json({ error:  app?.error || "something went wrong" });
  }
  logger.success(app); 
  res.status(200).json(app);
}catch(err : any) { 
  logger.error(err);
  res.status(500).json({ error: "something went wrong while creating app" });
}
};

export const getMyApp = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const app = await getUserApplication(user.userId);

    if (!app) {
      return res.status(200).json({ app: null });
    }

    if ('error' in (app as any)) {
      return res.status(500).json({ error: (app as any).error });
    }

    return res.status(200).json({ app });
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "something went wrong while fetching app" });
  }
};

export const updateAppSettings = async(req : Request , res  : Response) => { 
  try { 
    const {appId , name , requireEmailVerification} = req.body;
    const user = req.user; 
    if(!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if(!appId){ 
      return res.status(400).json({ error: "appId is required" });
    }
    
    const result = await updateApplicationSettings( appId , user.userId, { 
      name, 
      requireEmailVerification 
    });
    
    if (!result || 'error' in result) {
      return res.status(400).json({ error: result.error || "something went wrong" });
    }
    
    res.status(200).json(result);
  }catch(err  : any ){ 
    logger.error(err);
   return res.status(500).json({ error: "something went wrong while updating app" });
  }
}

export const DeleteApp = async (req : Request , res : Response) => { 
  try { 
    const {appId} = req.body;
    const user = req.user; 
    if(!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if(!appId){ 
      return res.status(400).json({ error: "appId is required" });
    }
    const result = await deleteApp
    ( appId , user.userId);
    
    if (!result || 'error' in result) {
      return res.status(400).json({ error: result.error || "something went wrong" });
    }
    res.status(200).json(result.message);
  }catch(err  : any ){ 
    logger.error(err);
  }}

  export const getAppUsers = async (req: Request, res: Response) => {
    try { 
      const { appId } = req.body;
      const user = req.user; 
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      } 
      if (!appId) {
        return res.status(400).json({ error: "appId is required" });
      }
      
      const result = await getApplicationUsers(user.userId, appId);
      
      if (!result || 'error' in result) {
        return res.status(400).json({ error: result.error || "something went wrong" });
      }
      res.status(200).json(result);
    } catch (err: any) {
      logger.error(err);
      return res.status(500).json({ error: "something went wrong while fetching app users" });
    }
  }

export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
        user: {
          application: {
            userId: user.userId
          }
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
        isActive: true,
        createdAt: true,
        lastUsedAt: true
      },
      orderBy: {
        lastUsedAt: 'desc'
      }
    });

    res.status(200).json(sessions);
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "Failed to fetch user sessions" });
  }
}