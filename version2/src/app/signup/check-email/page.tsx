import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-3xl tracking-tight">
          Check your email
        </h1>
        <p className="mt-3 text-sm text-muted">
          We&apos;ve sent a confirmation link to finish setting up your
          account. Click it, then come back and sign in.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-foreground/40"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
