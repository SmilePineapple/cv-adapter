import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AutoCvForm from "@/components/AutoCvForm";

export const metadata = { title: "Build a CV from scratch — MyCV Buddy" };

export default function AutoCvPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to dashboard
      </Link>

      <h1 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
        Build a CV from scratch
      </h1>
      <p className="mt-2 text-sm text-muted">
        No existing CV to upload? Describe your background in your own words
        and we&apos;ll structure it into a proper CV you can then tailor to
        any job.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <AutoCvForm />
      </div>
    </div>
  );
}
