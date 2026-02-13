import crypto from "crypto";
import { nanoid } from "nanoid";
import { logger } from "../../config/logger.js";
import prisma from "../../config/prisma.js";
import { 
  CreateApplicationParams, 
  UpdateApplicationParams, 
  UpdateApplicationSettingsParams, 
  DeleteApplicationParams, 
  GetApplicationUsersParams,
  ApplicationResponse,
  ManageDomainsParams,
  GetActiveSessionsParams,
  ToggleAppRegistrationParams
} from "./Application.types.js";


export const createApplication = async (params: CreateApplicationParams): Promise<ApplicationResponse> => {
  const { name, userId } = params;
  
  try {
    if (!name) {
      return { error: "name is required" };
    }

    // Only allow one application per user
    const existing = await prisma.application.findFirst({
      where: { userId }
    });

    if (existing) {
      return { error: "You already have an application" };
    }

    const apiKey = `ak_${nanoid()}`;
    const secretKey = crypto.randomBytes(48).toString("base64");
    const app = await prisma.application.create({
      data: { name, apiKey, secretKey, userId },
    });
    if (!app) {
      return { error: "something went wrong" };
    }
    return { apiKey, secretKey, appId: app.id, name: app.name, requireEmailVerification: app.requireEmailVerification, allowedDomains: app.allowedDomains };
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to create application" }
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
        allowedDomains: true,
        createdAt: true,
        updatedAt: true, 
        isRegistrationOpen : true
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

export const updateApplicationSettings = async (params: UpdateApplicationSettingsParams) => {
  const { appId, userId, settings } = params;
  
  try {
    const app = await prisma.application.findFirst({
      where: { id: appId, userId }
    });
    logger.info(app);

    if (!app) {
      return { error: "App not found or unauthorized" };
    }

    const updatedApp = await prisma.application.update({
      where: { id: appId, userId },
      data: settings,
      select: { id: true, name: true, requireEmailVerification: true, allowedDomains: true }
    });
    
    return updatedApp;
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to update application" };
  }
};

export const deleteApp = async (params: DeleteApplicationParams) => {
  const { appId, userId } = params;
  
  try {
    const app = await prisma.application.findFirst({
      where: {
        id: appId,
        userId
      },
      select: {
        id: true
      }
    });
    if (!app) {
      return { error: "App not found or unauthorized" }
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
      where: {
        id: app.id
      }
    });
    
    return { message: "App and all associated data deleted successfully" }
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to delete app" }
  }
}

export const getApplicationUsers = async (params: GetApplicationUsersParams) => {
  const { userId, appId } = params;
  
  try {
    const app = await prisma.application.findFirst({
      where: {
        id: appId,
        userId
      },
      select: {
        id: true
      }
    });
    if (!app) {
      return { error: "App not found or unauthorized" }
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

export const addAllowedDomain = async (params: ManageDomainsParams) => {
  const { appId, userId, domain } = params;
  
  try {
    const app = await prisma.application.findFirst({
      where: { id: appId, userId },
      select: { allowedDomains: true }
    });
    
    if (!app) {
      return { error: "App not found or unauthorized" };
    }
    
    if (app.allowedDomains.includes(domain)) {
      return { error: "Domain already exists" };
    }
    
    const updatedApp = await prisma.application.update({
      where: { id: appId, userId },
      data: {
        allowedDomains: [...app.allowedDomains, domain]
      },
      select: { allowedDomains: true }
    });
    
    return { allowedDomains: updatedApp.allowedDomains };
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to add domain" };
  }
};

export const removeAllowedDomain = async (params: ManageDomainsParams) => {
  const { appId, userId, domain } = params;
  
  try {
    const app = await prisma.application.findFirst({
      where: { id: appId, userId },
      select: { allowedDomains: true }
    });
    
    if (!app) {
      return { error: "App not found or unauthorized" };
    }
    
    const updatedApp = await prisma.application.update({
      where: { id: appId, userId },
      data: {
        allowedDomains: app.allowedDomains.filter(d => d !== domain)
      },
      select: { allowedDomains: true }
    });
    
    return { allowedDomains: updatedApp.allowedDomains };
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to remove domain" };
  }
};

export const getActiveSessions = async (params: GetActiveSessionsParams) => {
  const { appId, userId } = params;
  
  try {
    const app = await prisma.application.findFirst({
      where: { id: appId, userId },
      select: { id: true }
    });
    
    if (!app) {
      return { error: "App not found or unauthorized" };
    }
    
    const sessions = await prisma.session.findMany({
      where: {
        user: {
          applicationId: app.id
        },
        isActive: true
      },
      select: {
        id: true,
        userId: true,
        deviceName: true,
        browser: true,
        os: true,
        deviceType: true,
        location: true,
        ipAddress: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
        user: {
          select: {
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        lastUsedAt: 'desc'
      }
    });

    return sessions;
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to fetch active sessions" };
  }
};

export const toggleAppRegistration = async (params: ToggleAppRegistrationParams) => {
  const { appId, userId , allowed } = params;
  
  try {
    const app = await prisma.application.findFirst({
      where: { id: appId, userId },
      select: {isRegistrationOpen : true}
    });
    
    if (!app) {
      return { error: "App not found or unauthorized" };
    }
    
    const updatedApp = await prisma.application.update({
      where: { id: appId, userId },
      data: {
        isRegistrationOpen: allowed
      },
      select: { isRegistrationOpen: true }
    });
    
    return { isRegistrationOpen: updatedApp.isRegistrationOpen };
  } catch (err: any) {
    logger.error(err);
    return { error: "Failed to toggle registration" };
  }
};