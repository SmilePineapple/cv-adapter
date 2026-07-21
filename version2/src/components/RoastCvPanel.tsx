"use client";

import { useState } from "react";

const LEVELS = [
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "brutal", label: "Brutal" },
];

const STYLES = [
  { value: "funny", label: "Funny" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "professional", label: "Professional" },
  { value: "savage", label: "Savage" },
];

export default function RoastCvPanel({ cvId }: { cvId: string }) {
  const [level, setLevel] = useState("medium");
  const [style, setStyle] = useState("funny");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roast, setRoast] = useState<string | null>(null);

  async function handleRoast() {
    setPending(true);
    setError(null);
    setRoast(null);

    try {
      const res = await fetch("/api/roast-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, level, style }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      setRoast(data.roast);
      setPending(false);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="font-medium">Roast my CV</h3>
      <p className="mt-1 text-sm text-muted">
        For fun, not feedback. Get a comedic critique of this CV.
      </p>

      <div className="mt-4 flex flex-wrap gap-4">
        <div>
          <label htmlFor="roastLevel" className="mb-1.5 block text-xs font-medium text-muted">
            Level
          </label>
          <select
            id="roastLevel"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="roastStyle" className="mb-1.5 block text-xs font-medium text-muted">
            Style
          </label>
          <select
            id="roastStyle"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleRoast}
        disabled={pending}
        className="mt-4 min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Roasting…" : "Roast it"}
      </button>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {roast && (
        <p className="mt-4 whitespace-pre-line rounded-xl border border-border bg-background p-4 text-sm leading-relaxed">
          {roast}
        </p>
      )}
    </div>
  );
}
