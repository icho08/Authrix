
import express from "express";
import { createApp, DeleteApp, getAppUsers, getMyApp, updateAppSettings, getUserSessions, addDomain, removeDomain, getActiveSessions } from "../../controllers/admin/appController.js";
import { verifyApiKey } from "../../middleware/apiAuth.js";
import { createAppLimiter } from "../../middleware/rateLimiter.js";
import { authenticateUser } from "../../middleware/jwtAuth.js";

const router = express.Router(); 

router.post("/apps", createAppLimiter, verifyApiKey, authenticateUser, createApp);
router.get("/apps/me", verifyApiKey, authenticateUser, getMyApp);
router.post("/apps/update-settings",  verifyApiKey, authenticateUser,  updateAppSettings);
router.post("/apps/delete",  verifyApiKey, authenticateUser,  DeleteApp);
router.post("/apps/application-users",  verifyApiKey, authenticateUser,  getAppUsers);
router.post("/apps/user-sessions",  verifyApiKey, authenticateUser,  getUserSessions);
router.post("/apps/domains/add", verifyApiKey, authenticateUser, addDomain);
router.post("/apps/domains/remove", verifyApiKey, authenticateUser, removeDomain);
// get active sessions
router.post('/active-sessions', verifyApiKey, authenticateUser, getActiveSessions);

export default router; 
