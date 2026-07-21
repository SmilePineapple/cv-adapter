"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { at: 0, label: "Reading your CV…" },
  { at: 3000, label: "Matching your experience to the job description…" },
  { at: 10000, label: "Writing tailored bullet points…" },
  { at: 20000, label: "Checking ATS match…" },
  { at: 27000, label: "Finishing up…" },
];

// The actual tailoring call is one atomic ~20-30s AI request with no
// server-side milestones to report — there's nothing real to poll. Rather
// than leave the button saying "Tailoring…" with zero other feedback for
// half a minute (confirmed as the actual complaint: it doesn't read as
// "working," it reads as "stuck"), this eases a progress bar toward ~92%
// on a timer and cycles through plausible stage labels, so there's
// continuous visible motion the whole wait instead of a static button.
// It never claims 100% on its own — the parent unmounts this the moment
// the real response comes back and navigates to the result.
export default function GenerationProgress() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsedMs(Date.now() - start), 200);
    return () => clearInterval(id);
  }, []);

  const percent = Math.min(92, Math.round(100 * (1 - Math.exp(-elapsedMs / 15000))));
  const stage = [...STAGES].reverse().find((s) => elapsedMs >= s.at) || STAGES[0];

  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{stage.label}</span>
        <span className="text-muted tabular-nums">{percent}%</span>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
