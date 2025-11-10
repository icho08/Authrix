import express from "express";
import { register, getProfile, refreshToken, login, logout, logoutAll, logoutOthers, getSessions} from "../../controllers/auth/userController";
import { verifyApiKey } from "../../middleware/apiAuth";
import { authenticateUser } from "../../middleware/jwtAuth";
import { authLimiter, loginLimiter } from "../../middleware/rateLimiter";

const router = express.Router();

router.post("/register", authLimiter, verifyApiKey, register);
router.post("/login", loginLimiter, verifyApiKey, login);
router.post("/refresh", authLimiter, verifyApiKey, refreshToken);
router.post("/logout", verifyApiKey, logout);
router.post("/logout-all", verifyApiKey, authenticateUser, logoutAll);
router.post("/logout-others", verifyApiKey, authenticateUser, logoutOthers);
router.get("/profile", verifyApiKey, authenticateUser, getProfile);
router.get("/sessions", verifyApiKey, authenticateUser, getSessions);

export default router;
