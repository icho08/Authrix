import { Request, Response } from 'express';
import { createApplication } from '../../models/admin/Application';
import { logger } from '../../config/logger';

export const createApp = async (req: Request, res: Response) => {
  const { name } = req.body;
  if(!name) { 
    return res.status(400).json({ error: "name is required" });
  }
  
  const app = await createApplication(name); 
  if(!app) {
    return res.status(500).json({ error: "something went wrong" });
  }
  
  logger.success(app); 
  res.status(200).json(app);
};
