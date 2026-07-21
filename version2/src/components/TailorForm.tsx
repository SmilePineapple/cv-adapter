"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GenerationProgress from "./GenerationProgress";

export default function TailorForm({ cvId }: { cvId: string }) {
  const router = useRouter();
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="jobTitle" className="mb-1.5 block text-sm font-medium">
          Job title
        </label>
        <input
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          placeholder="e.g. Senior Product Designer"
          className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
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
          rows={10}
          placeholder="Paste the full job description here…"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
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
  );
}
