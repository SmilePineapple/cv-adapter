"use client";

import { useEffect, useState } from "react";

export type ProgressStage = { at: number; label: string };

// Shared by GenerationProgress and UploadProgress — both wrap a single
// atomic AI request with no server-side milestones to poll, so both fake
// continuous motion on a timer with plausible stage labels rather than
// leaving a button frozen on "Tailoring…"/"Uploading…" for several
// seconds with zero other feedback (confirmed as the actual complaint for
// tailoring — the same "is this stuck?" read applies to upload). Never
// reaches 100% on its own; the parent unmounts this the moment the real
// response lands.
export default function ProgressBar({
  stages,
  easeMs = 15000,
  cap = 92,
}: {
  stages: ProgressStage[];
  easeMs?: number;
  cap?: number;
}) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsedMs(Date.now() - start), 200);
    return () => clearInterval(id);
  }, []);

  const percent = Math.min(cap, Math.round(100 * (1 - Math.exp(-elapsedMs / easeMs))));
  const stage = [...stages].reverse().find((s) => elapsedMs >= s.at) || stages[0];

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
