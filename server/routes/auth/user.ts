import express from "express";
import { register, getProfile, refreshToken, login, logout, logoutAll, logoutOthers, getSessions, verifyEmail, requestPasswordReset, resetPassword} from "../../controllers/auth/userController.js";
import { verifyApiKey } from "../../middleware/apiAuth.js";
import { authenticateUser } from "../../middleware/jwtAuth.js";
import { authLimiter, loginLimiter } from "../../middleware/rateLimiter.js";


const router = express.Router();

router.post("/register", authLimiter, verifyApiKey, register);
router.post("/login", loginLimiter, verifyApiKey, login);
router.post("/refresh", authLimiter, verifyApiKey, refreshToken);
router.post("/logout", verifyApiKey, logout);
router.post("/logout-all", verifyApiKey, authenticateUser, logoutAll);
// router.post("/logout-r", verifyApiKey, authenticateUser, logoutOthers);
router.post("/verify-email", verifyApiKey, verifyEmail);
router.post("/request-password-reset", authLimiter, verifyApiKey, requestPasswordReset);
router.post("/reset-password", authLimiter, verifyApiKey, resetPassword);
router.get("/profile", verifyApiKey, authenticateUser, getProfile);
router.get("/sessions", verifyApiKey, authenticateUser, getSessions);
router.get("/verify" , authLimiter , verifyEmail ); 
export default router;
