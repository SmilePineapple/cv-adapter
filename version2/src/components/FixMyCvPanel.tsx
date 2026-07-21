"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Review = {
  overall_assessment: string;
  strengths: string[];
  improvements: string[];
  missing_sections: string[];
  keywords_to_add: string[];
  formatting_tips: string[];
};

export default function FixMyCvPanel({ generationId }: { generationId: string }) {
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  async function handleReview() {
    setReviewing(true);
    setError(null);
    setApplied(false);

    try {
      const res = await fetch("/api/review-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setReviewing(false);
        return;
      }

      setReview(data);
      setReviewing(false);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setReviewing(false);
    }
  }

  async function handleApply() {
    if (!review) return;
    setApplying(true);
    setError(null);

    try {
      const res = await fetch("/api/apply-improvements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId, review }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setApplying(false);
        return;
      }

      setApplying(false);
      setApplied(true);
      setReview(null);
      router.refresh();
    } catch {
      setError("Something went wrong. Please check your connection.");
      setApplying(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Fix my CV</h3>
          <p className="mt-1 text-sm text-muted">
            Get an AI review of this version, then apply the suggested
            improvements automatically.
          </p>
        </div>
        {!review && (
          <button
            onClick={handleReview}
            disabled={reviewing}
            className="min-h-[44px] shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reviewing ? "Reviewing…" : "Review my CV"}
          </button>
        )}
      </div>

      {applied && (
        <p className="mt-4 text-sm text-accent">
          Improvements applied — the CV above has been updated.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {review && (
        <div className="mt-6 space-y-5 border-t border-border pt-6">
          <p className="text-sm leading-relaxed">{review.overall_assessment}</p>

          {review.improvements.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted">
                Suggested improvements
              </h4>
              <ul className="mt-1.5 space-y-1 text-sm">
                {review.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.keywords_to_add.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted">
                Keywords to add
              </h4>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {review.keywords_to_add.map((k) => (
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

          {review.formatting_tips.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted">
                Formatting tips
              </h4>
              <ul className="mt-1.5 space-y-1 text-sm">
                {review.formatting_tips.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleApply}
              disabled={applying}
              className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {applying ? "Applying…" : "Apply these improvements"}
            </button>
            <button
              onClick={() => setReview(null)}
              className="min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
