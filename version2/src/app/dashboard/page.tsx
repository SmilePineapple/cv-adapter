import Link from "next/link";
import {
  FileText,
  Mail,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFreeUsageStatus, FREE_MONTHLY_GENERATION_LIMIT } from "@/lib/subscription";
import UploadForm from "@/components/UploadForm";
import QuickTailorForm from "@/components/QuickTailorForm";

type FileMeta = {
  name?: string;
  size?: number;
  upload_date?: string;
};

function formatSize(bytes?: number) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: cvs }, { data: generations }, { data: coverLetters }, usage] =
    await Promise.all([
      supabase
        .from("cvs")
        .select("id, file_meta, created_at")
        .eq("user_id", user!.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
      supabase
        .from("generations")
        .select("id, cv_id, job_title, ats_score, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("cover_letters")
        .select("id, generation_id, job_title, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
      getFreeUsageStatus(supabase, user!.id),
    ]);

  const cvList = cvs || [];
  const generationList = generations || [];
  const coverLetterList = coverLetters || [];

  const generationsByCv = new Map<string, number>();
  for (const gen of generationList) {
    generationsByCv.set(gen.cv_id, (generationsByCv.get(gen.cv_id) || 0) + 1);
  }

  const scoredGenerations = generationList.filter(
    (g) => typeof g.ats_score === "number"
  );
  const avgAts = scoredGenerations.length
    ? Math.round(
        scoredGenerations.reduce((sum, g) => sum + (g.ats_score || 0), 0) /
          scoredGenerations.length
      )
    : null;

  const cvNameById = new Map(
    cvList.map((cv) => [cv.id, (cv.file_meta as FileMeta)?.name || "CV"])
  );

  type Activity = {
    id: string;
    type: "generation" | "cover_letter";
    title: string;
    subtitle: string;
    created_at: string;
    href: string;
    atsScore?: number | null;
  };

  const activity: Activity[] = [
    ...generationList.map((g) => ({
      id: g.id,
      type: "generation" as const,
      title: `Tailored for ${g.job_title}`,
      subtitle: cvNameById.get(g.cv_id) || "CV",
      created_at: g.created_at,
      href: `/dashboard/generations/${g.id}`,
      atsScore: g.ats_score,
    })),
    ...coverLetterList.map((c) => ({
      id: c.id,
      type: "cover_letter" as const,
      title: `Cover letter for ${c.job_title}`,
      subtitle: "Cover letter",
      created_at: c.created_at,
      href: `/dashboard/cover-letters/${c.id}`,
    })),
  ]
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 6);

  const stats = [
    { label: "CVs uploaded", value: cvList.length, icon: FileText },
    { label: "Tailored versions", value: generationList.length, icon: Sparkles },
    { label: "Cover letters", value: coverLetterList.length, icon: Mail },
    {
      label: "Avg. ATS match",
      value: avgAts !== null ? `${avgAts}%` : "—",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Overview</h1>
          <p className="mt-2 max-w-md text-sm text-muted">
            Everything you&apos;ve uploaded and tailored, in one place.
          </p>
        </div>
      </div>

      {!usage.pro && (
        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 ${
            usage.remaining === 0
              ? "border-accent/40 bg-accent/5"
              : "border-border bg-surface"
          }`}
        >
          <p className="text-sm">
            {usage.remaining === 0 ? (
              <>
                <span className="font-medium">
                  You&apos;ve used your free tailored CV this month.
                </span>{" "}
                <span className="text-muted">
                  Upgrade to Pro for unlimited generations and DOCX export.
                </span>
              </>
            ) : (
              <span className="text-muted">
                Free plan — {usage.generationsUsed} of{" "}
                {FREE_MONTHLY_GENERATION_LIMIT} tailored CV used this month.
              </span>
            )}
          </p>
          <Link
            href="/dashboard/billing"
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-accent/90"
          >
            {usage.remaining === 0 ? "Upgrade to Pro" : "See plans"}
          </Link>
        </div>
      )}

      {/* Stats - a wall of zeros isn't a useful first thing for a brand-new
          user to see, so this only appears once there's something to show. */}
      {cvList.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <stat.icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
              <p className="mt-3 font-display text-2xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {cvList.length > 0 && (
        <div className="mt-8">
          <QuickTailorForm
            cvOptions={cvList.map((cv) => ({
              id: cv.id,
              label: (cv.file_meta as FileMeta)?.name || "Untitled CV",
            }))}
          />
        </div>
      )}

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_360px]">
        {/* Your CVs */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Your CVs
            </h2>
          </div>

          {cvList.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {cvList.map((cv) => {
                const meta = (cv.file_meta || {}) as FileMeta;
                const versionCount = generationsByCv.get(cv.id) || 0;
                return (
                  <Link
                    key={cv.id}
                    href={`/dashboard/${cv.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-foreground/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                        <FileText
                          className="h-4 w-4 text-accent"
                          strokeWidth={1.75}
                        />
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="mt-4">
                      <p className="truncate font-medium">
                        {meta.name || "Untitled CV"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {formatSize(meta.size)} &middot;{" "}
                        {formatDate(cv.created_at)}
                      </p>
                    </div>
                    {versionCount > 0 && (
                      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                        <Sparkles className="h-3 w-3" strokeWidth={1.75} />
                        {versionCount} tailored{" "}
                        {versionCount === 1 ? "version" : "versions"}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : null}

          <div className="mt-4">
            <UploadForm compact={cvList.length > 0} />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Nothing to upload?{" "}
            <Link
              href="/dashboard/auto-cv"
              className="text-foreground underline underline-offset-4"
            >
              Build a CV from scratch
            </Link>
            .
          </p>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Recent activity
          </h2>
          {activity.length > 0 ? (
            <div className="mt-4 space-y-2">
              {activity.map((item) => {
                const Icon = item.type === "generation" ? Sparkles : Mail;
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.href}
                    className="flex items-start gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:border-foreground/30"
                  >
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={1.75}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {typeof item.atsScore === "number" && (
                        <span className="text-xs font-medium text-accent">
                          {item.atsScore}%
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="h-3 w-3" strokeWidth={1.75} />
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <p className="text-sm text-muted">
                Nothing yet — tailor a CV to see activity here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
