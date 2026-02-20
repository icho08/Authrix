import { Request, Response } from "express";
import prisma from "../../config/prisma.js";
import { logger } from "../../config/logger.js";
import { triggerNewMessage, triggerConversationUpdate, triggerStaffUpdate, triggerTicketDeleted } from "../../utils/pusherService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.OPENROUTER_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const startConversation = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }
    const { subject } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check for existing open conversations
    const activeConversation = await prisma.conversation.findFirst({
      where: {
        userId,
        status: { not: "CLOSED" }
      }
    });

    if (activeConversation) {
      return res.status(400).json({ 
        error: "You already have an active support ticket. Please close it before starting a new one." 
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        subject,
        status: "AI_FIRST",
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    // Notify staff about new conversation
    await triggerStaffUpdate(conversation);

    res.status(201).json(conversation);
  } catch (error) {
    logger.error("Failed to start conversation:", error);
    res.status(500).json({ error: "Failed to start conversation" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }
    const { conversationId, content } = req.body;
    
    if (!conversationId || !content) {
      return res.status(400).json({ error: "Missing required fields: conversationId, content" });
    }
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        senderType: "USER",
        senderId: userId,
      },
    });

    await triggerNewMessage(conversationId, message);

    // AI Logic if status is AI_FIRST
    if (conversation.status === "AI_FIRST") {
      handleAIResponse(conversationId, content);
    }

    res.status(201).json(message);
  } catch (error) {
    logger.error("Failed to send message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.status(200).json(conversations);
  } catch (error) {
    logger.error("Failed to fetch conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(messages);
  } catch (error) {
    logger.error("Failed to fetch messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const closeConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Trigger deletion event BEFORE deleting from DB
    await triggerTicketDeleted(conversationId);

    // Manual cleanup to handle foreign key constraint if cascade fails
    await prisma.message.deleteMany({
      where: { conversationId },
    });

    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    // Notify staff
    await triggerStaffUpdate({ id: conversationId, status: "CLOSED", userId });

    res.status(200).json({ success: true, message: "Ticket deleted" });
  } catch (error) {
    logger.error("Failed to close conversation:", error);
    res.status(500).json({ error: "Failed to close conversation" });
  }
};

const handleAIResponse = async (conversationId: string, userMessage: string) => {
  try {
    const prompt = `You are a support agent for Authrix, an Authentication as a Service platform. 
    A user is asking: "${userMessage}". 
    Provide a helpful, concise response. 
    If the user needs complex help or wants to talk to a human, end your response with "[STAFF_REQUIRED]".`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const isStaffRequired = responseText.includes("[STAFF_REQUIRED]");
    const cleanedResponse = responseText.replace("[STAFF_REQUIRED]", "").trim();

    const aiMessage = await prisma.message.create({
      data: {
        conversationId,
        content: cleanedResponse,
        senderType: "AI",
      },
    });

    await triggerNewMessage(conversationId, aiMessage);

    if (isStaffRequired) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { status: "STAFF_REQUIRED" },
      });
      // Trigger update for staff to see status change
      const updatedConv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { user: true },
      });
      await triggerStaffUpdate(updatedConv);
    }
  } catch (error) {
    console.error("AI Response error:", error);
  }
};
