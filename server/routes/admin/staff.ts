import express from "express";
import { getAllTickets, sendStaffMessage, getTicketMessages, closeTicket } from "../../controllers/admin/staffController.js";
import { staffLogin, initFirstStaff } from "../../controllers/admin/staffAuthController.js";
import { authenticateStaff } from "../../middleware/staffAuth.js";

const router = express.Router();

// Staff Auth Routes
router.post("/login", staffLogin);
router.post("/init", initFirstStaff);

// Staff Support Dashboard Routes
router.get("/tickets", authenticateStaff, getAllTickets);
router.get("/tickets/:conversationId/messages", authenticateStaff, getTicketMessages);
router.post("/tickets/message", authenticateStaff, sendStaffMessage);
router.post("/tickets/close", authenticateStaff, closeTicket);

export default router;
