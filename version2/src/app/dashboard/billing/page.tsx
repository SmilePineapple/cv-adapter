import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFreeUsageStatus, FREE_MONTHLY_GENERATION_LIMIT } from "@/lib/subscription";
import { UpgradeButton, ManageBillingButton } from "@/components/BillingActions";

export const metadata = { title: "Billing — MyCV Buddy" };

const PRO_FEATURES = [
  "Unlimited tailored CV generations",
  "PDF & DOCX export",
  "Fix my CV",
  "Roast my CV",
  "Interview prep & simulator",
  "Skills assessments",
  "Career coach",
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pro, generationsUsed } = await getFreeUsageStatus(supabase, user!.id);

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
        Billing
      </h1>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        {pro ? (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
              Current plan
            </p>
            <p className="mt-1 font-display text-xl">Pro — £2.99/month</p>
            <p className="mt-2 text-sm text-muted">
              You have unlimited access to every tool.
            </p>
            <div className="mt-6">
              <ManageBillingButton />
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Current plan
            </p>
            <p className="mt-1 font-display text-xl">Free</p>
            <p className="mt-2 text-sm text-muted">
              {generationsUsed} of {FREE_MONTHLY_GENERATION_LIMIT} tailored
              CVs used this month. PDF export only.
            </p>

            <div className="mt-6 rounded-xl border border-accent/40 bg-background p-5">
              <p className="font-display text-lg">Pro — £2.99/month</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={1.75}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <UpgradeButton />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
