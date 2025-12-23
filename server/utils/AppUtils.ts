import prisma from "../config/prisma.js"

export const getAppById = async (appId : string) =>  { 
     const app = await prisma.application.findUnique({
         where : { 
             id : appId
         }
     })
if(!app) {
    return null
}
     return app
}