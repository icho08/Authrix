import { nanoid } from "nanoid";
import crypto from "crypto";
import { logger } from "../../config/logger";
import prisma from "../../config/prisma";
export const createApplication = async (name: string) => {
  try {
    if (!name) {
      return { error: "name is required" };
    }
    const apiKey = `ak_${nanoid()}}`;
    const secretKey = crypto.randomBytes(48).toString("base64");
    const app = await prisma.application.create({
      data: { name, apiKey, secretKey },
    });
    if (!app) {
      return { error: "something went wrong" };
    }
    return { apiKey, secretKey, appId: app.id };
  } catch (err: any) {
    logger.error(err);
  }
};
