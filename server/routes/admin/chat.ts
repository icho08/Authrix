import express from "express";
import { startConversation, sendMessage, getConversations, getMessages, closeConversation } from "../../controllers/admin/chatController.js";
import { verifyApiKey } from "../../middleware/apiAuth.js";
import { authenticateUser } from "../../middleware/jwtAuth.js";

const router = express.Router();

// User routes (Developers using the dashboard)
router.post("/start", verifyApiKey, authenticateUser, startConversation);
router.post("/message", verifyApiKey, authenticateUser, sendMessage);
router.get("/conversations", verifyApiKey, authenticateUser, getConversations);
router.get("/messages/:conversationId", verifyApiKey, authenticateUser, getMessages);
router.post("/close", verifyApiKey, authenticateUser, closeConversation);

export default router;
