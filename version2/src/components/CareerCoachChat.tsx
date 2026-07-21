"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

type CvOption = { id: string; label: string };

export default function CareerCoachChat({ cvOptions }: { cvOptions: CvOption[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [cvId, setCvId] = useState(cvOptions[0]?.id || "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || pending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, cvId: cvId || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      setPending(false);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-border bg-surface">
      {cvOptions.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <label htmlFor="cvContext" className="text-xs text-muted">
            Ground advice in:
          </label>
          <select
            id="cvContext"
            value={cvId}
            onChange={(e) => setCvId(e.target.value)}
            className="min-h-[36px] rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-accent"
          >
            <option value="">No CV context</option>
            {cvOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            Ask about career direction, negotiating an offer, whether to make a
            switch, how to talk about a gap on your CV — anything.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-accent text-black"
                : "bg-background text-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="max-w-[85%] rounded-xl bg-background px-4 py-2.5 text-sm text-muted">
            Thinking…
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="px-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-3">
        <label htmlFor="coach-message" className="sr-only">
          Message your career coach
        </label>
        <input
          id="coach-message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your career coach…"
          className="min-h-[44px] flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          aria-label="Send message"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-accent text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </form>
    </div>
  );
}
