import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Send,
  CheckCircle,
  ShieldAlert,
  Clock,
  User as UserIcon,
  Bot,
  LogOut,
} from "lucide-react";
import Pusher from "pusher-js";
import { staffApi } from "../../../utils/staffApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadTickets();
    Pusher.logToConsole = true;
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("staff-support");
    channel.bind("new-ticket", (data) => {
      console.log("[Pusher] Received ticket-update:", data);
      if (data.status === "CLOSED") {
        setTickets((prev) => prev.filter((t) => t.id !== data.id));
        if (activeTicket?.id === data.id) {
          setActiveTicket(null);
          toast.info("Active ticket was closed/deleted");
        }
      } else {
        // If ticket already exists in list, update it, otherwise add it
        setTickets((prev) => {
          const index = prev.findIndex((t) => t.id === data.id);
          if (index > -1) {
            const newTickets = [...prev];
            newTickets[index] = { ...newTickets[index], ...data };
            return newTickets;
          }
          return [data, ...prev];
        });
        if (data.status === "AI_FIRST") {
          toast("New support ticket!", { icon: "🎫" });
        }
      }
    });

    return () => {
      pusher.unsubscribe("staff-support");
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeTicket) {
      loadMessages(activeTicket.id);

      const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      });

      const channel = pusher.subscribe(`conversation-${activeTicket.id}`);
      channel.bind("new-message", (data) => {
        console.log("[Pusher] Received new-message for ticket:", data);
        setMessages((prev) => [...prev, data]);
      });

      channel.bind("ticket-deleted", (data) => {
        console.log("[Pusher] Ticket deleted:", data);
        setActiveTicket(null);
        setMessages([]);
      });

      return () => {
        pusher.unsubscribe(`conversation-${activeTicket.id}`);
        pusher.disconnect();
      };
    }
  }, [activeTicket]);

  useEffect(scrollToBottom, [messages]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await staffApi.getTickets();
      setTickets(res);
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (ticketId) => {
    try {
      const res = await staffApi.getMessages(ticketId);
      setMessages(res);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeTicket) return;

    try {
      await staffApi.sendMessage(activeTicket.id, input);
      setInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleCloseTicket = async () => {
    if (!activeTicket) return;
    try {
      await staffApi.closeTicket(activeTicket.id);
      toast.success("Ticket closed");
      loadTickets();
      setActiveTicket(null);
    } catch (error) {
      toast.error("Failed to close ticket");
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Ticket List Sidebar */}
      <aside className="w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            Authrix Support
          </h2>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 relative">
          <Search className="absolute left-7 top-7 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setActiveTicket(ticket)}
              className={`w-full p-4 border-b border-slate-100 dark:border-slate-800/50 flex flex-col gap-1 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 ${
                activeTicket?.id === ticket.id
                  ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-r-4 border-r-indigo-600"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-sm truncate">
                  {ticket.user?.username}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ticket.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {ticket.subject || "No subject"}
              </p>
              <div
                className={`mt-1 text-[10px] px-2 py-0.5 rounded-full w-fit font-medium ${
                  ticket.status === "AI_FIRST"
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40"
                    : ticket.status === "STAFF_REQUIRED"
                      ? "bg-red-100 text-red-600 dark:bg-red-900/40 animate-pulse"
                      : "bg-green-100 text-green-600 dark:bg-green-900/40"
                }`}
              >
                {ticket.status.replace("_", " ")}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative bg-slate-50 dark:bg-slate-900/20">
        {!activeTicket ? (
          <div className="text-center opacity-40">
            <MessageSquare className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-lg font-medium">
              Select a ticket to start responding
            </h3>
            <p className="text-sm">Real-time developer support portal</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 shadow-sm">
            {/* Chat Header */}
            <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2.5 rounded-2xl">
                  <UserIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold">{activeTicket.user?.username}</h3>
                  <p className="text-xs text-slate-500">
                    {activeTicket.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium">Status</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                    Current Step
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${activeTicket.status === "ACTIVE" ? "bg-green-500" : "bg-red-500 animate-pulse"}`}
                  ></div>
                  <span className="text-xs font-bold">
                    {activeTicket.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.senderType === "STAFF" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      msg.senderType === "STAFF"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : msg.senderType === "AI"
                          ? "bg-slate-100 dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700 italic"
                          : "bg-white dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 opacity-60 text-[10px] font-bold uppercase tracking-widest">
                      {msg.senderType === "AI" && <Bot className="w-3 h-3" />}
                      {msg.senderType}
                    </div>
                    {msg.content}
                  </div>
                  <span className="mt-1 text-[9px] text-slate-400 ml-2 mr-2">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Area */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={handleSend}
                className="flex gap-3 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Reply to ${activeTicket.user?.username}...`}
                  className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl disabled:opacity-50 transition-all active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* User Info Sidebar */}
      {activeTicket && (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden xl:flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg">{activeTicket.user?.username}</h3>
            <p className="text-sm text-slate-500">{activeTicket.user?.email}</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">
                User Details
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                    {activeTicket.user?.plan || "FREE"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Joined</span>
                  <span className="font-medium">
                    {activeTicket.user?.createdAt
                      ? new Date(
                          activeTicket.user.createdAt,
                        ).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Account Type</span>
                  <span className="font-medium">
                    {activeTicket.userId ? "Logged In" : "Guest"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleCloseTicket}
                className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Close Ticket
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default SupportDashboard;
