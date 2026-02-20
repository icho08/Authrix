import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  ShieldAlert,
  Clock,
  CheckCircle,
} from "lucide-react";
import Pusher from "pusher-js";
import { adminApi } from "../../utils/adminApi";
import toast from "react-hot-toast";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !conversation) {
      loadConversation();
    }
    scrollToBottom();
  }, [isOpen, messages]);

  useEffect(() => {
    if (conversation) {
      Pusher.logToConsole = true;
      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      });

      console.log(`[Pusher] Subscribing to conversation-${conversation.id}`);

      const channel = pusher.subscribe(`conversation-${conversation.id}`);
      channel.bind("new-message", (data) => {
        console.log("[Pusher] Received new-message:", data);
        setMessages((prev) => [...prev, data]);
      });

      channel.bind("ticket-deleted", (data) => {
        console.log("[Pusher] Ticket deleted:", data);
        setConversation(null);
        setMessages([]);
        toast("Support session ended.", { icon: "👋" });
      });

      return () => {
        console.log(
          `[Pusher] Unsubscribing from conversation-${conversation.id}`,
        );
        pusher.unsubscribe(`conversation-${conversation.id}`);
        pusher.disconnect();
      };
    }
  }, [conversation]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/api/chat/conversations");
      if (res && res.length > 0) {
        setConversation(res[0]); // Load most recent
        const msgRes = await adminApi.get(`/api/chat/messages/${res[0].id}`);
        setMessages(msgRes);
      } else {
        // Start a new one if none exists
        const startRes = await adminApi.post("/api/chat/start", {
          subject: "General Support",
        });
        setConversation(startRes);
      }
    } catch (error) {
      console.error("Chat load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation) return;

    const tempInput = input;
    setInput("");

    try {
      await adminApi.post("/api/chat/message", {
        conversationId: conversation.id,
        content: tempInput,
      });
    } catch (error) {
      toast.error("Failed to send message");
      setInput(tempInput);
    }
  };

  const handleClose = async () => {
    if (!conversation) return;
    try {
      await adminApi.closeConversation(conversation.id);
      toast.success("Ticket closed");
      setConversation(null);
      setMessages([]);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to close ticket");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Authrix Support</h3>
                <p className="text-[10px] text-indigo-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  AI & Staff Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                title="Close Ticket"
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors text-indigo-100 hover:text-white"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-xs">How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.senderType === "USER" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.senderType === "USER"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : msg.senderType === "AI"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700"
                          : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 rounded-bl-none border border-indigo-200 dark:border-indigo-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {!loading && conversation?.status === "STAFF_REQUIRED" && (
              <div className="flex flex-col items-center gap-2 py-4 px-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  <Clock className="w-3 h-3 animate-spin" />
                  Staff Escalation
                </div>
                <p className="text-[11px] text-center text-slate-600 dark:text-slate-400">
                  Please wait, a staff member will contact you soon.
                </p>
              </div>
            )}

            {!loading && conversation?.status === "CLOSED" && (
              <div className="text-center py-6">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mx-auto w-fit">
                  Ticket Closed
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || conversation?.status === "CLOSED"}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
