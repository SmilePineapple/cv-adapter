import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFreeUsageStatus } from "@/lib/subscription";
import { normalizeSectionContent } from "@/lib/cv-content-normalize";
import CoverLetterForm from "@/components/CoverLetterForm";
import ExportPanel from "@/components/ExportPanel";
import FixMyCvPanel from "@/components/FixMyCvPanel";
import InterviewPrepPanel from "@/components/InterviewPrepPanel";
import InterviewSimulatorPanel from "@/components/InterviewSimulatorPanel";
import UpgradePrompt from "@/components/UpgradePrompt";

type OutputSections = {
  sections: { type: string; content: string; order: number }[];
};

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

export default async function GenerationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: generation } = await supabase
    .from("generations")
    .select("id, cv_id, job_title, ats_score, output_sections, created_at")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!generation) notFound();

  const usage = await getFreeUsageStatus(supabase, user!.id);
  const pro = usage.pro;

  const { data: coverLetters } = await supabase
    .from("cover_letters")
    .select("id, job_title, created_at")
    .eq("generation_id", generation.id)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: pastPreps } = await supabase
    .from("interview_preps")
    .select("id, interview_data, created_at")
    .eq("cv_id", generation.cv_id)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const output = generation.output_sections as OutputSections;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/dashboard/${generation.cv_id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to CV
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-2xl tracking-tight sm:text-3xl">
          Tailored for {generation.job_title}
        </h1>
        {typeof generation.ats_score === "number" && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent px-3 py-1 text-xs font-medium text-accent">
            <TrendingUp className="h-3 w-3" strokeWidth={1.75} />
            ATS match {generation.ats_score}%
          </span>
        )}
      </div>

      <div className="mt-6">
        <ExportPanel generationId={generation.id} />
      </div>

      {!pro && usage.remaining === 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/5 px-5 py-4">
          <p className="text-sm">
            <span className="font-medium">
              That was your free tailored CV for this month.
            </span>{" "}
            <span className="text-muted">
              Upgrade to Pro for unlimited generations, DOCX export, and every
              extra tool below.
            </span>
          </p>
          <Link
            href="/dashboard/billing"
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-accent/90"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      <div className="mt-6">
        {pro ? (
          <FixMyCvPanel generationId={generation.id} />
        ) : (
          <UpgradePrompt feature="Fix My CV" />
        )}
      </div>

      <div className="mt-6">
        {pro ? (
          <InterviewPrepPanel
            generationId={generation.id}
            pastPreps={(pastPreps || []).map((p) => ({
              id: p.id,
              createdAt: p.created_at,
              data: p.interview_data,
            }))}
          />
        ) : (
          <UpgradePrompt feature="Interview Prep" />
        )}
      </div>

      <div className="mt-6">
        {pro ? (
          <InterviewSimulatorPanel generationId={generation.id} />
        ) : (
          <UpgradePrompt feature="Interview Simulator" />
        )}
      </div>

      <div className="mt-10 space-y-6 rounded-2xl border border-border bg-surface p-6">
        {output.sections
          .sort((a, b) => a.order - b.order)
          .map((section, i) => (
            <div key={i}>
              <h3 className="text-xs font-medium uppercase tracking-wide text-accent">
                {SECTION_LABELS[section.type] || section.type}
              </h3>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
                {normalizeSectionContent(section.content)}
              </p>
            </div>
          ))}
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Cover letter
        </h2>

        {coverLetters && coverLetters.length > 0 && (
          <div className="mt-4 space-y-2">
            {coverLetters.map((letter) => (
              <Link
                key={letter.id}
                href={`/dashboard/cover-letters/${letter.id}`}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-foreground/30"
              >
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
                  Cover letter for {letter.job_title}
                </span>
                <span className="text-xs text-muted">
                  {new Date(letter.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}

        <p className="mt-4 text-sm text-muted">
          {coverLetters && coverLetters.length > 0
            ? "Generate another version, addressed differently:"
            : "Generate a matching cover letter for this application."}
        </p>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
          <CoverLetterForm generationId={generation.id} />
        </div>
      </div>
    </div>
  );
}
