"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  MessageSquare,
  Mail,
  User,
  Calendar,
  Search,
  Phone,
  Send,
  Reply as ReplyIcon,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Reply {
  id: string;
  message: string;
  author_name: string;
  user_id?: number;
  created_at: string;
}

interface ContactQuery {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  replies: Reply[];
  created_at: string;
}

export default function QueriesPage() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [submittingReply, setSubmittingReply] = useState<{
    [key: number]: boolean;
  }>({});

  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchQueries = async () => {
    try {
      const data = await apiFetch<ContactQuery[]>("/contact");
      setQueries(data);

      const userStr = localStorage.getItem("user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error("Failed to fetch queries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleReplySubmit = async (queryId: number) => {
    const text = replyText[queryId];
    if (!text?.trim()) return;

    setSubmittingReply((prev) => ({ ...prev, [queryId]: true }));
    try {
      await apiFetch(`/contact/${queryId}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: text }),
      });
      toast.success("Reply sent successfully");
      setReplyText((prev) => ({ ...prev, [queryId]: "" }));
      await fetchQueries();
    } catch (error: any) {
      toast.error(error.message || "Failed to send reply");
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [queryId]: false }));
    }
  };

  const handleDelete = async (queryId: number) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;

    try {
      await apiFetch(`/contact/${queryId}`, { method: "DELETE" });
      toast.success("Query deleted successfully");
      await fetchQueries();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete query");
    }
  };

  const handleDeleteReply = async (queryId: number, replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this specific reply?"))
      return;

    try {
      await apiFetch(`/contact/${queryId}/reply/${replyId}`, {
        method: "DELETE",
      });
      toast.success("Reply deleted successfully");
      await fetchQueries();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete reply");
    }
  };

  const filteredQueries = queries.filter(
    (q) =>
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[#9f4d2c]/10 border-t-[#9f4d2c]"></div>
        <span className="text-xs font-bold text-[#4a403a]/40 uppercase tracking-[0.2em]">
          Retrieving Client Intelligence...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1a120e] tracking-tight">
            Client Queries
          </h1>
          <p className="text-[#4a403a] font-medium opacity-70 mt-1">
            Direct communications and inquiries from your showroom visitors.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a403a]/40" />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#9f4d2c]/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-[#1a120e] focus:ring-1 focus:ring-[#9f4d2c]/30 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((query) => (
            <div
              key={query.id}
              className="bg-white rounded-[2rem] border border-[#9f4d2c]/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#9f4d2c]/5 flex items-center justify-center text-[#9f4d2c]">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a120e] text-lg leading-none">
                        {query.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[#4a403a]/60">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            {query.email}
                          </span>
                        </div>
                        {query.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              {query.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 bg-[#fcf9f5] border border-[#9f4d2c]/10 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-[#9f4d2c]" />
                    <span className="text-[10px] font-bold text-[#1a120e] uppercase tracking-wider">
                      {format(
                        new Date(query.created_at),
                        "MMM dd, yyyy • HH:mm",
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {query.subject && (
                    <div className="inline-block px-3 py-1 bg-[#9f4d2c]/5 text-[#9f4d2c] text-[10px] font-black uppercase tracking-[0.15em] rounded-lg">
                      Subject: {query.subject}
                    </div>
                  )}
                  <div className="bg-[#fcf9f5]/50 p-6 rounded-2xl border border-[#9f4d2c]/5">
                    <p className="text-sm text-[#4a403a] leading-relaxed font-medium italic">
                      "{query.message}"
                    </p>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="mt-8 space-y-6">
                  {query.replies && query.replies.length > 0 && (
                    <div className="space-y-4 ml-8 border-l-2 border-[#9f4d2c]/10 pl-6">
                      <h4 className="text-[10px] font-black text-[#9f4d2c] uppercase tracking-widest flex items-center gap-2">
                        <ReplyIcon className="w-3 h-3" />
                        Intelligence Responses
                      </h4>
                      {query.replies.map((reply, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-sm text-[#1a120e] font-semibold bg-[#9f4d2c]/5 p-4 rounded-xl rounded-tl-none flex-1">
                              {reply.message}
                            </p>
                            {/* Strictly show delete ONLY for admin's own replies */}
                            {((reply.user_id != null &&
                              currentUser?.id != null &&
                              Number(reply.user_id) ===
                                Number(currentUser.id)) ||
                              (reply.user_id == null &&
                                reply.author_name === "Admin")) && (
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
                          <span className="text-[9px] font-bold text-[#4a403a]/40 uppercase tracking-tighter">
                            {reply.author_name} •{" "}
                            {format(new Date(reply.created_at), "MMM d, HH:mm")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <textarea
                        value={replyText[query.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [query.id]: e.target.value,
                          }))
                        }
                        placeholder="Type your official response..."
                        className="w-full bg-[#fcf9f5] border border-[#9f4d2c]/0 rounded-2xl py-4 px-6 text-sm font-medium text-[#1a120e] focus:ring-1 focus:ring-[#9f4d2c]/30 outline-none transition-all resize-none h-24"
                      />
                    </div>
                    <button
                      onClick={() => handleReplySubmit(query.id)}
                      disabled={
                        !replyText[query.id]?.trim() ||
                        submittingReply[query.id]
                      }
                      className="p-4 bg-[#9f4d2c] text-white rounded-2xl hover:bg-[#9f4d2c]/90 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-[#9f4d2c]/10"
                    >
                      {submittingReply[query.id] ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#9f4d2c]/5 flex justify-end gap-4">
                  <a
                    href={`mailto:${query.email}`}
                    className="flex items-center gap-2 px-6 py-2.5 text-[#4a403a]/60 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#9f4d2c]/5 hover:text-[#9f4d2c] transition-all duration-300"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email Client
                  </a>

                  <button
                    onClick={() => handleDelete(query.id)}
                    className="flex items-center gap-2 px-6 py-2.5 text-red-500/70 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Conversation
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 bg-white rounded-[2.5rem] border border-dashed border-[#9f4d2c]/20 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-[#9f4d2c]/5 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#9f4d2c]/20" />
            </div>
            <h3 className="text-lg font-bold text-[#1a120e]">
              No Queries Found
            </h3>
            <p className="text-xs font-medium text-[#4a403a]/40 uppercase tracking-widest mt-2">
              {searchTerm
                ? "Adjust your search parameters"
                : "Awaiting client intelligence communications"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
