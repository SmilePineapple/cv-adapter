import Link from "next/link";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isProUser } from "@/lib/subscription";
import SkillsQuizPanel from "@/components/SkillsQuizPanel";
import UpgradePrompt from "@/components/UpgradePrompt";

export const metadata = { title: "Skills Assessment — MyCV Buddy" };

type PastResult = {
  id: string;
  percentage_score: number;
  questions_correct: number;
  questions_total: number;
  created_at: string;
  skill_assessments: { job_role: string } | { job_role: string }[] | null;
};

export default async function SkillsAssessmentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // skill_assessment_results only has RLS policies for service-role access
  // (see src/lib/supabase/admin.ts) — the admin client is scoped to this
  // user explicitly via .eq("user_id", ...) below since it bypasses RLS.
  const admin = createAdminClient();
  const pro = await isProUser(supabase, user!.id);

  const [{ data: cvs }, { data: pastResults }] = await Promise.all([
    supabase
      .from("cvs")
      .select("id, file_meta")
      .eq("user_id", user!.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    admin
      .from("skill_assessment_results")
      .select("id, percentage_score, questions_correct, questions_total, created_at, skill_assessments(job_role)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const cvOptions = (cvs || []).map((cv) => ({
    id: cv.id,
    label: (cv.file_meta as { name?: string })?.name || "Untitled CV",
  }));

  const results = (pastResults || []) as unknown as PastResult[];

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
        Skills Assessment
      </h1>
      <p className="mt-2 text-sm text-muted">
        Test your knowledge on the skills from your CV, or any skills you
        want to check yourself on.
      </p>

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Past results
          </h2>
          <div className="mt-3 space-y-2">
            {results.map((r) => {
              const role = Array.isArray(r.skill_assessments)
                ? r.skill_assessments[0]?.job_role
                : r.skill_assessments?.job_role;
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
                    {role || "General"} — {r.questions_correct}/{r.questions_total} correct
                  </span>
                  <span className="text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        {pro ? (
          <SkillsQuizPanel cvOptions={cvOptions} />
        ) : (
          <UpgradePrompt feature="Skills Assessment" />
        )}
      </div>
    </div>
  );
}
