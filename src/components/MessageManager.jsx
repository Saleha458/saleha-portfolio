import { useCallback, useEffect, useState } from "react";

import {
  getMessages,
  deleteMessage,
} from "../services/messageService";

function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getMessages();

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteMessage(id);

      setMessages((prev) =>
        prev.filter((message) => message.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);

      alert("Failed to delete message.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    let value = date;

    if (
      typeof date === "object" &&
      typeof date.toDate === "function"
    ) {
      value = date.toDate();
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Contact Messages
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Messages submitted through your portfolio contact form.
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-slate-400">
            Loading messages...
          </p>
        </div>
      ) : messages.length === 0 ? (
        /* EMPTY STATE */
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <div className="mb-4 text-4xl">
            ✉️
          </div>

          <h3 className="text-lg font-semibold text-white">
            No messages yet
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Messages from your portfolio contact form will appear
            here.
          </p>
        </div>
      ) : (
        /* MESSAGE LIST */
        <div className="space-y-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              {/* TOP */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="wrap-break-word text-xl font-semibold text-white">
                    {message.name || "Unknown"}
                  </h3>

                  {message.email && (
                    <a
                      href={`mailto:${message.email}`}
                      className="mt-1 block wrap-break-word text-sm text-indigo-400 transition hover:text-indigo-300"
                    >
                      {message.email}
                    </a>
                  )}
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  {message.createdAt && (
                    <p className="text-xs text-slate-500">
                      {formatDate(message.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* SUBJECT */}
              {message.subject && (
                <div className="mt-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subject
                  </p>

                  <p className="wrap-break-word text-sm font-medium text-slate-200">
                    {message.subject}
                  </p>
                </div>
              )}

              {/* MESSAGE */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Message
                </p>

                <div className="rounded-xl border border-white/5 bg-slate-950/50 p-4">
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-300">
                    {message.message || "No message content."}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
                {message.email && (
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(
                      `Re: ${
                        message.subject || "Your message"
                      }`
                    )}`}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                  >
                    Reply
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(message.id)}
                  disabled={deletingId === message.id}
                  className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === message.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REFRESH */}
      {!loading && (
        <div className="mt-6">
          <button
            type="button"
            onClick={loadMessages}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Refresh Messages
          </button>
        </div>
      )}
    </div>
  );
}

export default MessageManager;