import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function UpgradePrompt({ feature }: { feature: string }) {
  return (
    <div className="rounded-2xl border border-accent/40 bg-surface p-6 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-background">
        <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 font-medium">{feature} is a Pro feature</h3>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted">
        Upgrade for £2.99/month to unlock this, plus unlimited tailored CVs
        and DOCX export.
      </p>
      <Link
        href="/dashboard/billing"
        className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent/90"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
