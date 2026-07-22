"use client";

import ProgressBar from "./ProgressBar";

const STAGES = [
  { at: 0, label: "Reading your CV…" },
  { at: 3000, label: "Matching your experience to the job description…" },
  { at: 10000, label: "Writing tailored bullet points…" },
  { at: 20000, label: "Checking ATS match…" },
  { at: 27000, label: "Finishing up…" },
];

export default function GenerationProgress() {
  return <ProgressBar stages={STAGES} easeMs={15000} />;
}
