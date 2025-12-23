import prisma from "../config/prisma.js";

export const doesUserExist = async (email: string, applicationId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      email_applicationId: {
        email,
        applicationId
      }
    }
  });
  
  return !!user;
};
