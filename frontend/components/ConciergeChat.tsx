"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot, X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; label: string }[];
};

type ConciergeChatProps = {
  open: boolean;
  onClose: () => void;
  onAvailabilityRequest: () => void;
};

export default function ConciergeChat({
  open,
  onClose,
  onAvailabilityRequest,
}: ConciergeChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello. I'm Simp’AI’otel, your concierge at The Orchid. Ask me about rooms, dining, amenities, policies, or your stay.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmedMessage,
    };

    const previousContext = messages.slice(-8);

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          session_id: "local-demo-session",
          context: previousContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.message ||
            "I'm sorry, I couldn't generate a response right now.",
          sources: data.sources ?? [],
        },
      ]);

      if (data.type === "availability_form") {
        onAvailabilityRequest();
      }
    } catch (error) {
      console.error("Simp’AI’otel request failed:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 backdrop-blur-sm sm:items-center"
        >
          <div className="flex h-[min(720px,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-[var(--orchid-border)] bg-[var(--orchid-card)] shadow-2xl">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[var(--orchid-border)] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--orchid-sage)]/15">
                  <Bot
                    size={19}
                    strokeWidth={1.7}
                    className="text-[var(--orchid-deep)]"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium">Simp’AI’otel</p>
                  <p className="text-xs text-[var(--orchid-muted)]">
                    The Orchid concierge
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close concierge"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </header>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6 sm:px-7">
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={
                    item.role === "user"
                      ? "ml-auto max-w-[82%]"
                      : "max-w-[88%]"
                  }
                >
                  <div
                    className={
                      item.role === "user"
                        ? "rounded-2xl rounded-tr-sm bg-[var(--orchid-deep)] px-5 py-4 text-sm leading-6 text-white"
                        : "rounded-2xl rounded-tl-sm bg-[var(--orchid-cream)] px-5 py-4 text-sm leading-6 text-[var(--orchid-muted)]"
                    }
                  >
                    {item.content}
                  </div>

                  {/* Source labels */}
                  {item.sources && item.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.sources.map((source) => (
                        <span
                          key={source.id}
                          className="rounded-full border border-[var(--orchid-border)] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--orchid-muted)]"
                        >
                          {source.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[var(--orchid-cream)] px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--orchid-muted)]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--orchid-muted)] [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--orchid-muted)] [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
              className="border-t border-[var(--orchid-border)] p-4 sm:p-5"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--orchid-border)] bg-white px-4 py-2">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask Simp’AI’otel anything..."
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[var(--orchid-muted)]"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={!message.trim() || loading}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--orchid-deep)] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowUp size={17} />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}