import { useEffect, useMemo, useState } from "react";

import {
  deleteContactMessage,
  getContactMessages,
  updateContactMessage,
} from "../services/contactService";

const formatDate = (value) => {
  if (!value) return "Date not available";

  try {
    let date;

    if (typeof value?.toDate === "function") {
      date = value.toDate();
    } else if (typeof value?.seconds === "number") {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "Date not available";
  }
};

const buildGmailReplyUrl = (message) => {
  const recipient = String(message?.email || "").trim();

  const subjectText = message?.subject
    ? `Re: ${message.subject}`
    : "Re: Your message from my portfolio";

  const bodyText = `Hi ${message?.name || "there"},

Thank you for reaching out through my portfolio.

I have received your message and will get back to you shortly.

Best regards,
Saleha Imtiaz

------------------------------
Original message:
${message?.message || ""}
`;

  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: recipient,
    su: subjectText,
    body: bodyText,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
};

function ContactManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [processingKey, setProcessingKey] = useState(null);

  const loadMessages = async (showRefreshState = false) => {
    try {
      setError("");

      if (showRefreshState) {
        setRefreshing(true);
      }

      const data = await getContactMessages();

      setMessages(Array.isArray(data) ? data : []);
    } catch (loadError) {
      console.error(
        "Failed to load contact messages:",
        loadError
      );

      setError(
        "Unable to load contact messages. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedMessage(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const unreadCount = useMemo(
    () =>
      messages.filter(
        (message) => !message.isRead
      ).length,
    [messages]
  );

  const getMessageKey = (message) =>
    `${message.collectionName || "contactMessages"}-${message.id}`;

  const handleToggleRead = async (message) => {
    const messageKey = getMessageKey(message);

    try {
      setProcessingKey(messageKey);

      const nextReadState = !message.isRead;

      await updateContactMessage(
        message.id,
        {
          isRead: nextReadState,
        },
        message.collectionName
      );

      setMessages((previous) =>
        previous.map((item) =>
          getMessageKey(item) === messageKey
            ? {
                ...item,
                isRead: nextReadState,
                read: nextReadState,
              }
            : item
        )
      );

      setSelectedMessage((previous) => {
        if (!previous) return previous;

        return getMessageKey(previous) === messageKey
          ? {
              ...previous,
              isRead: nextReadState,
              read: nextReadState,
            }
          : previous;
      });
    } catch (updateError) {
      console.error(
        "Failed to update message status:",
        updateError
      );

      alert("Could not update message status.");
    } finally {
      setProcessingKey(null);
    }
  };

  const handleDelete = async (message) => {
    const confirmed = window.confirm(
      `Delete the message from ${
        message.name || "this visitor"
      }?`
    );

    if (!confirmed) return;

    const messageKey = getMessageKey(message);

    try {
      setProcessingKey(messageKey);

      await deleteContactMessage(
        message.id,
        message.collectionName
      );

      setMessages((previous) =>
        previous.filter(
          (item) => getMessageKey(item) !== messageKey
        )
      );

      setSelectedMessage((previous) =>
        previous && getMessageKey(previous) === messageKey
          ? null
          : previous
      );
    } catch (deleteError) {
      console.error(
        "Failed to delete message:",
        deleteError
      );

      alert("Could not delete this message.");
    } finally {
      setProcessingKey(null);
    }
  };

  const handleReplyViaGmail = (message) => {
    const email = String(message?.email || "").trim();

    if (!email) {
      alert(
        "This message does not contain a valid email address."
      );
      return;
    }

    const gmailUrl = buildGmailReplyUrl(message);

    const gmailWindow = window.open(
      gmailUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (!gmailWindow) {
      window.location.href = gmailUrl;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm text-slate-400">
          Loading messages...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              Messages
            </h2>

            {unreadCount > 0 && (
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                {unreadCount} unread
              </span>
            )}
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage messages submitted through your portfolio
            contact form.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadMessages(true)}
          disabled={refreshing}
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <div
            className="mb-4 text-4xl"
            aria-hidden="true"
          >
            ✉️
          </div>

          <h3 className="text-lg font-semibold text-white">
            No messages yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Messages submitted through the portfolio contact
            form will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const messageKey = getMessageKey(message);
            const processing =
              processingKey === messageKey;

            return (
              <article
                key={messageKey}
                className={`rounded-2xl border p-5 transition ${
                  message.isRead
                    ? "border-white/10 bg-white/5"
                    : "border-indigo-500/30 bg-indigo-500/5"
                }`}
              >
                {/* TOP */}
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!message.isRead && (
                        <span className="rounded-full bg-indigo-500 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
                          NEW
                        </span>
                      )}

                      <h3 className="text-lg font-semibold text-white">
                        {message.name || "Unknown Visitor"}
                      </h3>
                    </div>

                    {message.email ? (
                      <a
                        href={`mailto:${message.email}`}
                        className="mt-1 block break-all text-sm text-indigo-400 transition hover:text-indigo-300"
                      >
                        {message.email}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500">
                        No email provided
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMessage(message)
                      }
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReplyViaGmail(message)
                      }
                      disabled={!message.email || processing}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reply via Gmail
                    </button>

                    <button
                      type="button"
                      disabled={processing}
                      onClick={() =>
                        handleToggleRead(message)
                      }
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {message.isRead
                        ? "Mark Unread"
                        : "Mark Read"}
                    </button>

                    <button
                      type="button"
                      disabled={processing}
                      onClick={() =>
                        handleDelete(message)
                      }
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processing
                        ? "Processing..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                {/* SUBJECT */}
                <div className="mt-5 rounded-xl border border-white/5 bg-slate-950/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subject
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-200">
                    {message.subject || "No subject"}
                  </p>
                </div>

                {/* MESSAGE */}
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Message
                  </p>

                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-400">
                    {message.message ||
                      "No message content."}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-message-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl sm:p-6"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                  Contact Message
                </p>

                <h3
                  id="contact-message-title"
                  className="mt-2 wrap-break-word text-2xl font-bold text-white"
                >
                  {selectedMessage.name ||
                    "Unknown Visitor"}
                </h3>

                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="mt-1 block break-all text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {selectedMessage.email}
                  </a>
                )}
              </div>

              <button
                type="button"
                aria-label="Close message"
                onClick={() => setSelectedMessage(null)}
                className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* DETAILS */}
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </p>

                <p className="mt-1 text-sm text-white">
                  {selectedMessage.subject ||
                    "No subject"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Received
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {formatDate(
                    selectedMessage.createdAt
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Message
                </p>

                <div className="mt-2 whitespace-pre-wrap wrap-break-word rounded-xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
                  {selectedMessage.message ||
                    "No message content."}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() =>
                  handleReplyViaGmail(selectedMessage)
                }
                disabled={!selectedMessage.email}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reply via Gmail
              </button>

              <button
                type="button"
                onClick={() =>
                  handleToggleRead(selectedMessage)
                }
                disabled={
                  processingKey ===
                  getMessageKey(selectedMessage)
                }
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                {selectedMessage.isRead
                  ? "Mark Unread"
                  : "Mark Read"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactManager;