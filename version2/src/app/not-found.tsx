import Link from "next/link";

export const metadata = { title: "Page not found — MyCV Buddy" };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-muted">
        That page doesn&apos;t exist — it may have moved. Here&apos;s where you
        probably meant to go:
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/"
          className="rounded-2xl border border-border bg-surface p-5 text-sm font-medium transition-colors hover:border-foreground/30"
        >
          Home
        </Link>
        <Link
          href="/ats-checker"
          className="rounded-2xl border border-border bg-surface p-5 text-sm font-medium transition-colors hover:border-foreground/30"
        >
          Free ATS Checker
        </Link>
        <Link
          href="/blog"
          className="rounded-2xl border border-border bg-surface p-5 text-sm font-medium transition-colors hover:border-foreground/30"
        >
          Blog
        </Link>
        <Link
          href="/signup"
          className="rounded-2xl border border-border bg-surface p-5 text-sm font-medium transition-colors hover:border-foreground/30"
        >
          Create a free account
        </Link>
      </div>

      <p className="mt-8 text-sm text-muted">
        Still stuck?{" "}
        <a
          href="mailto:support@mycvbuddy.com"
          className="text-foreground underline underline-offset-4"
        >
          support@mycvbuddy.com
        </a>
        .
      </p>
    </main>
  );
}
