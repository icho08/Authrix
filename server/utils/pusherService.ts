import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

// Use a function to get the Pusher instance to ensure env vars are loaded
let pusherInstance: Pusher | null = null;

const getPusher = () => {
  if (!pusherInstance) {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER;

    if (!appId || !key || !secret || !cluster) {
      console.warn("Pusher environment variables are missing!");
    }

    pusherInstance = new Pusher({
      appId: appId || "",
      key: key || "",
      secret: secret || "",
      cluster: cluster || "",
      useTLS: true,
    });
  }
  return pusherInstance;
};

export const triggerEvent = async (channel: string, event: string, data: any) => {
  try {
    const pusher = getPusher();
    console.log(`[Pusher] Triggering ${event} on channel ${channel}`);
    await pusher.trigger(channel, event, data);
  } catch (error) {
    console.error("Pusher trigger error:", error);
  }
};

export const triggerNewMessage = async (conversationId: string, message: any) => {
  return triggerEvent(`conversation-${conversationId}`, "new-message", message);
};

export const triggerConversationUpdate = async (userId: string, conversation: any) => {
  return triggerEvent(`user-${userId}`, "conversation-update", conversation);
};

export const triggerStaffUpdate = async (conversation: any) => {
  return triggerEvent("staff-support", "new-ticket", conversation);
};

export const triggerTicketDeleted = async (conversationId: string) => {
  return triggerEvent(`conversation-${conversationId}`, "ticket-deleted", { conversationId });
};
