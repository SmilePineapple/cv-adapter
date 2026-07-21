import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Mail, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isProUser } from "@/lib/subscription";
import TailorForm from "@/components/TailorForm";
import DeleteCvButton from "@/components/DeleteCvButton";
import RoastCvPanel from "@/components/RoastCvPanel";
import UpgradePrompt from "@/components/UpgradePrompt";
import type { ParsedCV } from "@/lib/cv-parsing";
import { normalizeSectionContent } from "@/lib/cv-content-normalize";

const SECTION_LABELS: Record<string, string> = {
  name: "Name",
  contact: "Contact",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  hobbies: "Hobbies & Interests",
  groups: "Groups & Memberships",
  strengths: "Strengths",
  additional: "Additional Information",
};

export default async function CVDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cv } = await supabase
    .from("cvs")
    .select("id, parsed_sections, file_meta, created_at")
    .eq("id", id)
    .eq("user_id", user!.id)
    .is("deleted_at", null)
    .single();

  if (!cv) notFound();

  const pro = await isProUser(supabase, user!.id);

  const { data: generations } = await supabase
    .from("generations")
    .select("id, job_title, ats_score, created_at")
    .eq("cv_id", cv.id)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const generationIds = (generations || []).map((g) => g.id);
  const { data: coverLetters } =
    generationIds.length > 0
      ? await supabase
          .from("cover_letters")
          .select("id, generation_id, job_title, created_at")
          .in("generation_id", generationIds)
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
      : { data: [] };

  const parsed = cv.parsed_sections as ParsedCV;
  const meta = (cv.file_meta || {}) as { name?: string };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to your CVs
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface">
            <FileText className="h-5 w-5 text-accent" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
              {meta.name || "Untitled CV"}
            </h1>
            <p className="text-xs text-muted">
              Uploaded {new Date(cv.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DeleteCvButton cvId={cv.id} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Parsed content
          </h2>
          <div className="mt-4 space-y-5 rounded-2xl border border-border bg-surface p-6">
            {parsed.sections
              .sort((a, b) => a.order - b.order)
              .map((section, i) => (
                <div key={i}>
                  <h3 className="text-xs font-medium uppercase tracking-wide text-accent">
                    {SECTION_LABELS[section.type] || section.type}
                  </h3>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">
                    {normalizeSectionContent(section.content)}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Tailor for a job
            </h2>
            <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
              <TailorForm cvId={cv.id} />
            </div>
          </div>

          {pro ? <RoastCvPanel cvId={cv.id} /> : <UpgradePrompt feature="Roast My CV" />}

          {generations && generations.length > 0 && (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Past versions
              </h2>
              <div className="mt-4 space-y-2">
                {generations.map((gen) => (
                  <Link
                    key={gen.id}
                    href={`/dashboard/generations/${gen.id}`}
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-foreground/30"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles
                        className="h-3.5 w-3.5 text-accent"
                        strokeWidth={1.75}
                      />
                      {gen.job_title}
                    </span>
                    <span className="flex items-center gap-3 text-xs text-muted">
                      {typeof gen.ats_score === "number" && (
                        <span className="text-accent">
                          {gen.ats_score}% match
                        </span>
                      )}
                      <span>
                        {new Date(gen.created_at).toLocaleDateString()}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {coverLetters && coverLetters.length > 0 && (
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Cover letters
              </h2>
              <div className="mt-4 space-y-2">
                {coverLetters.map((letter) => (
                  <Link
                    key={letter.id}
                    href={`/dashboard/cover-letters/${letter.id}`}
                    className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-foreground/30"
                  >
                    <span className="flex items-center gap-2">
                      <Mail
                        className="h-3.5 w-3.5 text-accent"
                        strokeWidth={1.75}
                      />
                      {letter.job_title}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(letter.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
