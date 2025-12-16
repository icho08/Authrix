import express from "express";
import { createApp, DeleteApp, getAppUsers, getMyApp, updateAppSettings, getUserSessions } from "../../controllers/admin/appController";
import { verifyApiKey } from "../../middleware/apiAuth";
import { createAppLimiter } from "../../middleware/rateLimiter";
import { authenticateUser } from "../../middleware/jwtAuth";

const router = express.Router(); 

router.post("/apps", createAppLimiter, verifyApiKey, authenticateUser, createApp);
router.get("/apps/me", verifyApiKey, authenticateUser, getMyApp);
router.post("/apps/update-settings",  verifyApiKey, authenticateUser,  updateAppSettings);
router.post("/apps/delete",  verifyApiKey, authenticateUser,  DeleteApp);
router.post("/apps/application-users",  verifyApiKey, authenticateUser,  getAppUsers);
router.post("/apps/user-sessions",  verifyApiKey, authenticateUser,  getUserSessions);
export default router; 
