import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase";
import { Mail, X, CheckCircle2, Circle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardCard, DashboardPageIcon, inputClass } from "../../components/ui/layout";

const PAGE_SIZE = 10;

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const toggleRead = async (id, value) => {
    await supabase.from("portfolio_messages").update({ is_read: value }).eq("id", id);
    fetchMessages();
  };

  const removeMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("portfolio_messages").delete().eq("id", id);
    fetchMessages();
  };

  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return messages;

    return messages.filter((message) => {
      return (
        (message.name || "").toLowerCase().includes(q) ||
        (message.email || "").toLowerCase().includes(q) ||
        (message.message || "").toLowerCase().includes(q)
      );
    });
  }, [messages, search]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const paginatedMessages = filteredMessages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const unreadCount = messages.filter((message) => !message.is_read).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <DashboardPageIcon>
            <Mail className="w-4 h-4" />
          </DashboardPageIcon>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Messages</h1>
            <p className="text-zinc-600 text-xs font-mono uppercase tracking-wider">
              {messages.length} total · {unreadCount} unread
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Total", value: messages.length },
            { label: "Unread", value: unreadCount },
            { label: "Read", value: messages.length - unreadCount },
          ].map((stat) => (
            <DashboardCard key={stat.label}>
              <div className="p-3 sm:p-4">
                <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-sky-400">{stat.value}</p>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or message..."
          className={`${inputClass} pl-10 pr-10 py-2.5 text-sm`}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {search && (
        <p className="text-xs text-gray-500 -mt-3">
          {filteredMessages.length} result{filteredMessages.length !== 1 ? "s" : ""} for "{search}"
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-zinc-800 border-t-sky-400 animate-spin" />
        </div>
      ) : paginatedMessages.length === 0 ? (
        <DashboardCard>
          <div className="p-14 text-center">
            <Mail className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {search ? "No messages match your search." : "No messages yet."}
            </p>
          </div>
        </DashboardCard>
      ) : (
        <div className="space-y-3">
          {paginatedMessages.map((message) => (
            <DashboardCard key={message.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-zinc-100 truncate">
                      {message.name}
                    </span>
                    <span className="text-xs text-gray-500">{message.email}</span>
                    <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                    <span
                      className={`text-xs font-medium rounded-full px-2 py-1 ${
                        message.is_read ? "bg-emerald-500/10 text-emerald-300" : "bg-sky-500/10 text-sky-300"
                      }`}
                    >
                      {message.is_read ? "Read" : "Unread"}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                    {message.message}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 self-start">
                  <button
                    onClick={() => toggleRead(message.id, !message.is_read)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-sky-500/20 text-sky-300 hover:bg-sky-500/10 transition-colors"
                  >
                    {message.is_read ? (
                      <Circle className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    {message.is_read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-red-500/20 text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredMessages.length)} of {filteredMessages.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-600 text-xs">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs border transition-all duration-200 ${
                      page === p
                        ? "bg-sky-500/10 border-sky-500/40 text-sky-300 font-medium"
                        : "border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-600"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
