import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function CoverLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: coverLetter } = await supabase
    .from("cover_letters")
    .select("id, generation_id, content, job_title, created_at")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!coverLetter) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/dashboard/generations/${coverLetter.generation_id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to CV
      </Link>

      <h1 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
        Cover letter for {coverLetter.job_title}
      </h1>
      <p className="mt-1 text-xs text-muted">
        Generated {new Date(coverLetter.created_at).toLocaleDateString()}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`/api/export-cover-letter/${coverLetter.id}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent/90"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          Export as PDF
        </a>
        <a
          href={`/api/export-cover-letter/${coverLetter.id}?format=docx`}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          Export as DOCX
        </a>
      </div>

      <div className="mt-10 whitespace-pre-line rounded-2xl border border-border bg-surface p-6 text-sm leading-relaxed">
        {coverLetter.content}
      </div>
    </div>
  );
}
