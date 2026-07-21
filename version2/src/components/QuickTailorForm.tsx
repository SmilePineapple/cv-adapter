"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import GenerationProgress from "./GenerationProgress";

type CvOption = { id: string; label: string };

export default function QuickTailorForm({ cvOptions }: { cvOptions: CvOption[] }) {
  const router = useRouter();
  const [cvId, setCvId] = useState(cvOptions[0]?.id || "");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, jobTitle, jobDescription }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      router.push(`/dashboard/generations/${data.id}`);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-accent/40 bg-surface p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
        <h2 className="font-medium">Tailor a CV</h2>
      </div>
      <p className="mt-1 text-sm text-muted">
        Pick a CV, paste a job description, and get a tailored version in
        seconds.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="quick-cv" className="mb-1.5 block text-sm font-medium">
            CV
          </label>
          <select
            id="quick-cv"
            value={cvId}
            onChange={(e) => setCvId(e.target.value)}
            required
            className="w-full min-h-[44px] rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          >
            {cvOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quick-job-title" className="mb-1.5 block text-sm font-medium">
            Job title
          </label>
          <input
            id="quick-job-title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            placeholder="e.g. Senior Product Designer"
            className="w-full min-h-[44px] rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="quick-job-description" className="mb-1.5 block text-sm font-medium">
            Job description
          </label>
          <textarea
            id="quick-job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            rows={6}
            placeholder="Paste the full job description here…"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        {pending && <GenerationProgress />}

        <button
          type="submit"
          disabled={pending}
          className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Tailoring…" : "Tailor my CV"}
        </button>
      </form>
    </div>
  );
}
