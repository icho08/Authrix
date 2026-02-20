import { Request, Response } from "express";
import prisma from "../../config/prisma.js";
import { logger } from "../../config/logger.js";
import { triggerNewMessage, triggerConversationUpdate, triggerStaffUpdate, triggerTicketDeleted } from "../../utils/pusherService.js";

// Get all active tickets for staff dashboard
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            plan: true,
            createdAt: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.status(200).json(tickets);
  } catch (error) {
    logger.error("Failed to fetch tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// Staff sends a message to the user
export const sendStaffMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, content } = req.body;
    const staffId = (req as any).staff?.id; // Assuming staff auth middleware sets this

    if (!staffId) {
      return res.status(401).json({ error: "Unauthorized Staff" });
    }

    // Update conversation status to ACTIVE if it was STAFF_REQUIRED or AI_FIRST
    const conversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { 
        status: "ACTIVE",
        staffId: staffId
      },
    });

    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        senderType: "STAFF",
        senderId: staffId,
      },
    });

    await triggerNewMessage(conversationId, message);
    await triggerConversationUpdate(conversation.userId, conversation);

    res.status(201).json(message);
  } catch (error) {
    logger.error("Failed to send staff message:", error);
    res.status(500).json({ error: "Failed to send staff message" });
  }
};

// Get messages for staff view
export const getTicketMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    
    // Check if staff
    if (!(req as any).staff) {
      return res.status(401).json({ error: "Unauthorized Staff" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(messages);
  } catch (error) {
    logger.error("Failed to fetch ticket messages:", error);
    res.status(500).json({ error: "Failed to fetch ticket messages" });
  }
};

export const closeTicket = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.body;
    const staffId = (req as any).staff?.id;

    if (!staffId) {
      return res.status(401).json({ error: "Unauthorized Staff" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Trigger deletion event BEFORE deleting from DB
    await triggerTicketDeleted(conversationId);

    // Manual cleanup
    await prisma.message.deleteMany({
      where: { conversationId },
    });

    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    // Notify staff to refresh list
    await triggerStaffUpdate({ id: conversationId, status: "CLOSED", userId: conversation.userId });

    res.status(200).json({ success: true, message: "Ticket deleted" });
  } catch (error) {
    logger.error("Failed to close ticket:", error);
    res.status(500).json({ error: "Failed to close ticket" });
  }
};
