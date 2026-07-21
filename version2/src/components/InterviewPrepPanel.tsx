"use client";

import { useState } from "react";
import { History } from "lucide-react";

type Question = {
  question: string;
  why_theyre_asking: string;
  suggested_approach: string;
};

type Prep = {
  questions: Question[];
  questions_to_ask_them: string[];
};

type PastPrep = {
  id: string;
  createdAt: string;
  data: Prep;
};

export default function InterviewPrepPanel({
  generationId,
  pastPreps = [],
}: {
  generationId: string;
  pastPreps?: PastPrep[];
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prep, setPrep] = useState<Prep | null>(
    pastPreps.length > 0 ? pastPreps[0].data : null
  );
  const [showHistory, setShowHistory] = useState(false);

  async function handleGenerate() {
    setPending(true);
    setError(null);
    setShowHistory(false);

    try {
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generationId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      setPrep(data);
      setPending(false);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Interview prep</h3>
          <p className="mt-1 text-sm text-muted">
            Likely interview questions for this role, based on your CV — with
            guidance on how to answer each one.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {pastPreps.length > 0 && (
            <button
              onClick={() => setShowHistory((s) => !s)}
              className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
            >
              <History className="h-3.5 w-3.5" strokeWidth={1.75} />
              History ({pastPreps.length})
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={pending}
            className="min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Generating…" : prep ? "Regenerate" : "Generate prep"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {showHistory && (
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          {pastPreps.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPrep(p.data);
                setShowHistory(false);
              }}
              className="block w-full rounded-lg border border-border px-4 py-2.5 text-left text-sm transition-colors hover:border-foreground/30"
            >
              Prep from {new Date(p.createdAt).toLocaleDateString()}
            </button>
          ))}
        </div>
      )}

      {prep && (
        <div className="mt-6 space-y-6 border-t border-border pt-6">
          <div className="space-y-5">
            {prep.questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium">{q.question}</p>
                <p className="mt-2 text-xs text-muted">
                  <span className="text-accent">Why they ask this: </span>
                  {q.why_theyre_asking}
                </p>
                <p className="mt-1.5 text-xs text-muted">
                  <span className="text-accent">How to approach it: </span>
                  {q.suggested_approach}
                </p>
              </div>
            ))}
          </div>

          {prep.questions_to_ask_them.length > 0 && (
            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted">
                Questions to ask them
              </h4>
              <ul className="mt-1.5 space-y-1 text-sm">
                {prep.questions_to_ask_them.map((q, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent">•</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
