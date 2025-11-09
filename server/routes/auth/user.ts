import express from "express";
import { register, getProfile, refreshToken, login} from "../../controllers/auth/userController";
import { verifyApiKey } from "../../middleware/apiAuth";
import { authenticateUser } from "../../middleware/jwtAuth";

const router = express.Router();

router.post("/register", verifyApiKey, register);
router.post("/refresh", verifyApiKey, refreshToken);
router.post("/login" , verifyApiKey , login);
router.get("/profile", verifyApiKey, authenticateUser, getProfile);

export default router;
