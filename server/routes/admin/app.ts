import express from "express";
import { createApp, DeleteApp, updateAppSettings } from "../../controllers/admin/appController";
import { verifyApiKey } from "../../middleware/apiAuth";
import { createAppLimiter } from "../../middleware/rateLimiter";
import { authenticateUser } from "../../middleware/jwtAuth";

const router = express.Router(); 

router.post("/apps", createAppLimiter, verifyApiKey, authenticateUser, createApp);
router.post("/apps/update-settings",  verifyApiKey, authenticateUser,  updateAppSettings);
router.post("/apps/delete",  verifyApiKey, authenticateUser,  DeleteApp);
export default router; 
