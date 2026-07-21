"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CoverLetterForm({
  generationId,
}: {
  generationId: string;
}) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [hiringManagerName, setHiringManagerName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId,
          companyName: companyName || undefined,
          hiringManagerName: hiringManagerName || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      router.push(`/dashboard/cover-letters/${data.id}`);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="companyName"
            className="mb-1.5 block text-sm font-medium"
          >
            Company name (optional)
          </label>
          <input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label
            htmlFor="hiringManagerName"
            className="mb-1.5 block text-sm font-medium"
          >
            Hiring manager (optional)
          </label>
          <input
            id="hiringManagerName"
            value={hiringManagerName}
            onChange={(e) => setHiringManagerName(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Writing…" : "Generate cover letter"}
      </button>
    </form>
  );
}
