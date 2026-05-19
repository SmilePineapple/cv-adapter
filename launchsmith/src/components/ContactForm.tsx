"use client";

import Link from "next/link";
import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setStatus("submitting");
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error || "Message failed to send.");
      }

      setStatus("success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Message failed to send.";
      setError(msg);
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 p-6 card-glass">
      {status === "success" ? (
        <div>
          <h2 className="text-base font-semibold tracking-tight text-white">
            Message sent
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Thanks — I’ll get back to you as soon as I can.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/thanks"
              className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold hover:opacity-95"
            >
              Next steps
            </Link>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="btn-secondary inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Send another
            </button>
          </div>
        </div>
      ) : (
        <form
          action={(fd) => void onSubmit(fd)}
          className="grid gap-4"
          aria-busy={status === "submitting"}
        >
          <div>
            <label className="text-sm font-semibold text-white" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none ring-0 placeholder:text-white/40 focus:border-[var(--accent-2)]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-white" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              required
              type="email"
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none ring-0 placeholder:text-white/40 focus:border-[var(--accent-2)]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              className="text-sm font-semibold text-white"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-white/40 focus:border-[var(--accent-2)]"
              placeholder="What do you want to build?"
            />
          </div>

          {status === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error ?? "Message failed to send."}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold hover:opacity-95 disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : "Send message"}
            </button>
            <div className="text-sm text-white/55">
              You’ll see a confirmation here after submit.
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
