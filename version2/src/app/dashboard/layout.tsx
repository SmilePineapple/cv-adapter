import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-display text-lg tracking-tight">
            mycv<span className="text-accent">buddy</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="hidden sm:inline">{user?.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border px-4 py-2 text-foreground transition-colors hover:border-foreground/40"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-6 pb-3 text-xs text-muted">
          <Link href="/dashboard" className="shrink-0 transition-colors hover:text-foreground">
            Overview
          </Link>
          <Link href="/dashboard/auto-cv" className="shrink-0 transition-colors hover:text-foreground">
            Build from scratch
          </Link>
          <Link href="/dashboard/career-coach" className="shrink-0 transition-colors hover:text-foreground">
            Career Coach
          </Link>
          <Link href="/dashboard/skills-assessment" className="shrink-0 transition-colors hover:text-foreground">
            Skills Assessment
          </Link>
          <Link href="/ats-checker" className="shrink-0 transition-colors hover:text-foreground">
            ATS Checker
          </Link>
          <Link href="/dashboard/billing" className="shrink-0 transition-colors hover:text-foreground">
            Billing
          </Link>
          <Link href="/help" className="shrink-0 transition-colors hover:text-foreground">
            Help
          </Link>
          <Link href="/contact" className="shrink-0 transition-colors hover:text-foreground">
            Contact
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
