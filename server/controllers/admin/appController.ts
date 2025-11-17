import { Request, Response } from 'express';
import { createApplication, deleteApp, updateApplicationSettings } from '../../models/admin/Application';
import { logger } from '../../config/logger';

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
    const result = await deleteApp( appId , user.userId);
    
    if (!result || 'error' in result) {
      return res.status(400).json({ error: result.error || "something went wrong" });
    }
    res.status(200).json(result);
  }catch(err  : any ){ 
    logger.error(err);
  }}