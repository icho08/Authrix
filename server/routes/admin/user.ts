import express from "express";
import { sendCustomEmail, resetUserPassword, deleteUser, exportUsers, toggleUserVerification } from "../../controllers/admin/userController.js";
import { verifyApiKey } from "../../middleware/apiAuth.js";
import { authenticateUser } from "../../middleware/jwtAuth.js";

const router = express.Router();

router.post("/send-email", verifyApiKey, authenticateUser, sendCustomEmail);
router.post("/reset-password", verifyApiKey, authenticateUser, resetUserPassword);
router.post("/toggle-verification", verifyApiKey, authenticateUser, toggleUserVerification);
router.post("/delete", verifyApiKey, authenticateUser, deleteUser);
router.post("/export", verifyApiKey, authenticateUser, exportUsers);

export default router;
