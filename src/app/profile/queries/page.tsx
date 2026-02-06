"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  MessageSquare,
  Mail,
  Calendar,
  Reply,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

interface ReplyData {
  id: string;
  message: string;
  author_name: string;
  user_id?: number;
  created_at: string;
}

interface UserQuery {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  replies: ReplyData[];
  created_at: string;
}

export default function UserQueriesPage() {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [submittingReply, setSubmittingReply] = useState<{
    [key: number]: boolean;
  }>({});

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchMyQueries() {
      try {
        const data = await apiFetch<UserQuery[]>("/my-queries");
        setQueries(data);

        // Load user info for matching
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error("Failed to fetch your queries", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyQueries();
  }, []);

  const handleDelete = async (queryId: number) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;

    try {
      await apiFetch(`/contact/${queryId}`, { method: "DELETE" });
      setQueries((prev) => prev.filter((q) => q.id !== queryId));
    } catch (error) {
      console.error("Failed to delete query", error);
      alert("Failed to delete query. Please try again.");
    }
  };

  const handleReplySubmit = async (queryId: number) => {
    const text = replyText[queryId];
    if (!text?.trim()) return;

    setSubmittingReply((prev) => ({ ...prev, [queryId]: true }));
    try {
      const updatedQuery = await apiFetch<UserQuery>(
        `/contact/${queryId}/reply`,
        {
          method: "POST",
          body: JSON.stringify({ message: text }),
        },
      );
      setQueries((prev) =>
        prev.map((q) => (q.id === queryId ? updatedQuery : q)),
      );
      setReplyText((prev) => ({ ...prev, [queryId]: "" }));
    } catch (error) {
      console.error("Failed to send reply", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [queryId]: false }));
    }
  };

  const handleDeleteReply = async (queryId: number, replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;

    try {
      const updatedQuery = await apiFetch<UserQuery>(
        `/contact/${queryId}/reply/${replyId}`,
        { method: "DELETE" },
      );
      setQueries((prev) =>
        prev.map((q) => (q.id === queryId ? updatedQuery : q)),
      );
    } catch (error) {
      console.error("Failed to delete reply", error);
      alert("Failed to delete reply. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-primary/10 border-t-primary"></div>
        <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">
          Loading your communications...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Communication Hub
        </h1>
        <p className="text-secondary font-medium mt-1">
          Track your inquiries and our support responses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {queries.length > 0 ? (
          queries.map((query) => (
            <div
              key={query.id}
              className="bg-white rounded-3xl border border-foreground/5 shadow-sm overflow-hidden"
            >
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                        Query #{query.id}
                      </span>
                      <span className="text-xs font-bold text-secondary/60 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(query.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-lg">
                      {query.subject || "No Subject"}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDelete(query.id)}
                    className="p-2 text-secondary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-primary/5 p-5 rounded-2xl rounded-tl-none border-l-4 border-primary/20 relative">
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium italic">
                    "{query.message}"
                  </p>
                </div>

                {query.replies && query.replies.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Reply className="w-3 h-3" />
                      Conversation History
                    </h4>
                    <div className="space-y-4">
                      {query.replies.map((reply, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start gap-4">
                              <div className="bg-white border border-primary/20 p-4 rounded-2xl rounded-tr-none shadow-sm shadow-primary/5 flex-1">
                                <p className="text-sm text-foreground font-semibold">
                                  {reply.message}
                                </p>
                              </div>
                              {/* Show delete if owned by ID or if missing ID and not from Admin */}
                              {((reply.user_id != null &&
                                currentUser?.id != null &&
                                Number(reply.user_id) ===
                                  Number(currentUser.id)) ||
                                (reply.user_id == null &&
                                  reply.author_name !== "Admin")) && (
                                <button
                                  onClick={() =>
                                    handleDeleteReply(query.id, reply.id)
                                  }
                                  className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete Reply"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="flex justify-end gap-2 text-[9px] font-bold text-secondary uppercase tracking-tighter">
                              <span>{reply.author_name}</span>
                              <span className="opacity-40">•</span>
                              <span>
                                {format(
                                  new Date(reply.created_at),
                                  "MMM d, HH:mm",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!query.replies || query.replies.length === 0) && (
                  <div className="pt-4 border-t border-foreground/5">
                    <div className="flex items-center gap-2 text-secondary/40">
                      <div className="w-1.5 h-1.5 bg-secondary/20 rounded-full animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest leading-none">
                        Waiting for expert review...
                      </span>
                    </div>
                  </div>
                )}

                {/* User Reply Form */}
                <div className="mt-6 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex-1 relative">
                    <textarea
                      value={replyText[query.id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [query.id]: e.target.value,
                        }))
                      }
                      placeholder="Add more details or respond to admin..."
                      className="w-full bg-white border border-primary/20 rounded-2xl py-3 px-4 text-sm font-medium text-foreground focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none h-12 hover:h-24 focus:h-24 scrollbar-none"
                    />
                  </div>
                  <button
                    onClick={() => handleReplySubmit(query.id)}
                    disabled={
                      !replyText[query.id]?.trim() || submittingReply[query.id]
                    }
                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-sm"
                    title="Send Reply"
                  >
                    {submittingReply[query.id] ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Reply className="w-5 h-5 -rotate-180" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 bg-white rounded-[2.5rem] border border-dashed border-foreground/10 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary/20" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No Communications Found
            </h3>
            <p className="text-sm font-medium text-secondary max-w-sm mt-2">
              You haven't sent any inquiries yet. Our experts are ready to
              assist you when you're ready.
            </p>
            <a
              href="/contact"
              className="mt-8 flex items-center gap-2 px-8 py-3 bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-hover transition-all group"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
