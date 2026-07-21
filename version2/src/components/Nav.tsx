import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg tracking-tight">
          mycv<span className="text-accent">buddy</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted sm:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#tools" className="transition-colors hover:text-foreground">
            Tools
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <Link href="/ats-checker" className="transition-colors hover:text-foreground">
            ATS Checker
          </Link>
        </div>
        <Link
          href="/login"
          className="min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
        >
          Sign in
        </Link>
      </nav>
    </header>
  );
}
