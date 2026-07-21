"use client";

import { useState } from "react";
import type { AtsResult } from "@/lib/ats-score";

export default function AtsCheckerForm() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      setResult(data);
      setPending(false);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="cvText" className="mb-1.5 block text-sm font-medium">
            Your CV text
          </label>
          <textarea
            id="cvText"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            required
            rows={12}
            placeholder="Paste your CV text here…"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="jobDescription"
            className="mb-1.5 block text-sm font-medium"
          >
            Job description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            rows={12}
            placeholder="Paste the job description here…"
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
          {pending ? "Checking…" : "Check my ATS score"}
        </button>
      </form>

      <div>
        {!result && (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
            Your score and breakdown will appear here.
          </div>
        )}

        {result && (
          <div className="space-y-6 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl tracking-tight text-accent">
                {result.score}
              </span>
              <span className="text-sm text-muted">/ 100 ATS match</span>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
                Keyword match
              </h3>
              <p className="mt-1 text-sm">
                {result.keywordMatchPercent}% of top job-description keywords
                found in your CV.
              </p>
            </div>

            {result.strengths.length > 0 && (
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
                  Strengths
                </h3>
                <ul className="mt-1.5 space-y-1 text-sm">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.issues.length > 0 && (
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
                  Issues to fix
                </h3>
                <ul className="mt-1.5 space-y-1 text-sm">
                  {result.issues.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-red-400">–</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.missingKeywords.length > 0 && (
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
                  Missing keywords
                </h3>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
