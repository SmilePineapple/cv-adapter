"use client";

import ProgressBar from "./ProgressBar";

const STAGES = [
  { at: 0, label: "Reading your file…" },
  { at: 800, label: "Extracting text…" },
  { at: 2200, label: "Identifying sections…" },
  { at: 4500, label: "Saving your CV…" },
];

// Upload is a much shorter round trip than tailoring (no job-matching
// step) — faster ease curve so the bar doesn't sit stalled at a low
// percentage for a 3-4s operation.
export default function UploadProgress() {
  return <ProgressBar stages={STAGES} easeMs={4000} />;
}
