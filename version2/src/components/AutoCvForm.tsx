"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoCvForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [background, setBackground] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/auto-cv-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, background }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      router.push(`/dashboard/${data.id}`);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jane Doe"
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="contact" className="mb-1.5 block text-sm font-medium">
            Contact details
          </label>
          <input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            placeholder="jane@example.com | 07000 000000"
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="background" className="mb-1.5 block text-sm font-medium">
          Tell us about your background
        </label>
        <p className="mb-1.5 text-xs text-muted">
          Jobs you&apos;ve had, what you did in each, your education, and your key
          skills — written in plain language, no need to format it. The more
          detail, the better the result.
        </p>
        <textarea
          id="background"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          required
          rows={12}
          placeholder="I've worked as a barista at Costa for 2 years, mostly on weekends while studying. Before that I did a BTEC in Business at..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Building your CV…" : "Generate my CV"}
      </button>
    </form>
  );
}
