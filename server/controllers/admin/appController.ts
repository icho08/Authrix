import { Request, Response } from 'express';
import { createApplication, deleteApp, getApplicationUsers, getUserApplications, updateApplicationSettings, addAllowedDomain, removeAllowedDomain, getActiveSessions as getActiveAppSessions, toggleAppRegistration, regenerateApiKey as regenerateAppKey } from '../../models/admin/Application.js';
import { logger } from '../../config/logger.js';
import prisma from '../../config/prisma.js';
import * as urlscanService from "../../utils/urlscanService.js";
import * as aiService from "../../utils/aiService.js";
import { submitScan, getScanResult } from '../../utils/urlscanService.js';

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
  const app = await createApplication({ name, userId: user.userId }); 
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

export const getMyApps = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const apps = await getUserApplications(user.userId);

    if (apps && 'error' in (apps as any)) {
      return res.status(500).json({ error: (apps as any).error });
    }

    return res.status(200).json(apps);
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json({ error: "something went wrong while fetching apps" });
  }
};

export const updateAppSettings = async(req : Request , res  : Response) => { 
  try { 
    const {appId , name , requireEmailVerification, allowedDomains} = req.body;
    const user = req.user; 
    if(!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if(!appId){ 
      return res.status(400).json({ error: "appId is required" });
    }
    
    const result = await updateApplicationSettings({
      appId,
      userId: user.userId,
      settings: {
        name,
        requireEmailVerification,
        allowedDomains
      }
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
    const result = await deleteApp({ appId, userId: user.userId });
    
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
      
      const result = await getApplicationUsers({ userId: user.userId, appId });
      
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
export const addDomain = async (req: Request, res: Response) => {
  try {
    const { appId, domain } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!appId || !domain) {
      return res.status(400).json({ error: "appId and domain are required" });
    }
    
    // Basic domain validation
    const domainRegex = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({ error: "Invalid domain format. Use format: https://example.com" });
    }
    
    const result = await addAllowedDomain({ appId, userId: user.userId, domain });
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to add domain" });
  }
};

export const removeDomain = async (req: Request, res: Response) => {
  try {
    const { appId, domain } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!appId || !domain) {
      return res.status(400).json({ error: "appId and domain are required" });
    }
    
    const result = await removeAllowedDomain({ appId, userId: user.userId, domain });
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to remove domain" });
  }
};


export const getActiveSessions = async (req: Request, res: Response) => {
  try {
    const { appId } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!appId) {
      return res.status(400).json({ error: "appId is required" });
    }
    
    const result = await getActiveAppSessions({ appId, userId: user.userId });
    
    if (result && 'error' in (result as any)) {
      return res.status(400).json({ error: (result as any).error });
    }
    
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to get active sessions" });
  }
};

export const toggleRegistration = async (req: Request, res: Response) => {
  try {
    const { appId  , allowed} = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!appId) {
      return res.status(400).json({ error: "appId is required" });
    }
    
  if(allowed === undefined){
    return res.status(400).json({ error: "allowed is required" });
  }
    const result = await toggleAppRegistration({ appId, userId: user.userId , allowed});
    
    if (result && 'error' in (result as any)) {
      return res.status(400).json({ error: (result as any).error });
    }
    
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to toggle registration" });
  }
};

export const startVulnerabilityScan = async (req: Request, res: Response) => {
  try {
    const { appId, domain } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!appId || !domain) {
      return res.status(400).json({ error: "appId and domain are required" });
    }

    // Verify application ownership and domain
    const app = await prisma.application.findFirst({
      where: {
        id: appId,
        userId: user.userId,
      },
    });

    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (!app.allowedDomains.includes(domain)) {
      return res.status(400).json({ error: "Domain not found in allowed domains" });
    }

    const scanResponse = await submitScan(domain, 'unlisted');
    res.status(200).json({
      message: "Scan started successfully",
      scanId: scanResponse.uuid,
      apiEndpoint: scanResponse.api,
      resultUrl: scanResponse.result,
    });
  } catch (error: any) {
    logger.error(`Vulnerability scan error: ${error.message}`);
    res.status(500).json({ error: error.message || "Failed to start vulnerability scan" });
  }
};

export const fetchScanResult = async (req: Request, res: Response) => {
  try {
    const { scanId } = req.params;
    if (!scanId) {
      return res.status(400).json({ error: "scanId is required" });
    }

    const result = await getScanResult(scanId);
    res.status(200).json(result);
  } catch (error: any) {
    // urlscan.io might return 404 while scan is still in progress
    if (error.response && error.response.status === 404) {
      return res.status(202).json({ message: "Scan is still in progress" });
    }
    logger.error(`Error fetching scan result: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch scan results" });
  }
};

export const analyzeVulnerability = async (req: Request, res: Response) => {
  try {
    const { scanId } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!scanId) {
      return res.status(400).json({ error: "scanId is required" });
    }

    // 1. Fetch the scan result data
    const scanData = await getScanResult(scanId);

    if (!scanData || scanData.message === "Scan is still in progress") {
      return res.status(400).json({ error: "Scan is still in progress. Please wait for completion before analysis." });
    }

    // 2. Pass data to AI for suggestions
    const aiResponse = await aiService.generateSecurityAdvice(scanData);

    res.status(200).json(aiResponse);
  } catch (error: any) {
    logger.error(`AI analysis error: ${error.message}`);
    res.status(500).json({ error: error.message || "Failed to generate AI analysis" });
  }
};

export const regenerateKey = async (req: Request, res: Response) => {
  try {
    const { appId } = req.body;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!appId) {
      return res.status(400).json({ error: "appId is required" });
    }
    
    const result = await regenerateAppKey({ appId, userId: user.userId });
    
    if (result && 'error' in (result as any)) {
      return res.status(400).json({ error: (result as any).error });
    }
    
    res.json(result);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to regenerate API key" });
  }
};