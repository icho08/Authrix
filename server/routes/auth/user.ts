import express from "express";
import { register } from "../../controllers/auth/userController";
import { verifyApiKey } from "../../middleware/apiAuth";

const router = express.Router();

router.post("/register", verifyApiKey, register);

export default router;
