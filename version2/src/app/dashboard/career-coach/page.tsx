import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isProUser } from "@/lib/subscription";
import CareerCoachChat from "@/components/CareerCoachChat";
import UpgradePrompt from "@/components/UpgradePrompt";

export const metadata = { title: "Career Coach — MyCV Buddy" };

export default async function CareerCoachPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pro = await isProUser(supabase, user!.id);

  const { data: cvs } = await supabase
    .from("cvs")
    .select("id, file_meta")
    .eq("user_id", user!.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const cvOptions = (cvs || []).map((cv) => ({
    id: cv.id,
    label: (cv.file_meta as { name?: string })?.name || "Untitled CV",
  }));

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
        Career Coach
      </h1>
      <p className="mt-2 text-sm text-muted">
        Ask anything about your career — optionally grounded in one of your
        uploaded CVs.
      </p>

      <div className="mt-8">
        {pro ? (
          <CareerCoachChat cvOptions={cvOptions} />
        ) : (
          <UpgradePrompt feature="Career Coach" />
        )}
      </div>
    </div>
  );
}
