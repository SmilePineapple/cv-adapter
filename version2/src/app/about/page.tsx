import Link from "next/link";

export const metadata = { title: "About — MyCV Buddy" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight sm:text-4xl">
        About MyCV Buddy
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <p>
          MyCV Buddy tailors your CV to a specific job in minutes instead of
          hours. Upload what you already have, paste the job description, and
          get a version that emphasizes the right experience in the right
          language — without inventing anything that isn&apos;t true.
        </p>
        <p>
          We built it because tailoring a CV for every application is
          tedious, and most people either skip it (and get filtered out by
          keyword-matching hiring software) or spend an evening rewriting the
          same document by hand. Neither should be necessary.
        </p>
        <p>
          Beyond tailoring, MyCV Buddy includes a free ATS checker, an AI
          review-and-fix pass, matching cover letters, and interview prep
          built from your actual CV and the job you&apos;re applying for —
          the full loop from &quot;I found a job posting&quot; to
          &quot;I&apos;m ready for the interview.&quot;
        </p>
        <p>
          This is a small, independently run product. If something&apos;s
          broken or missing, tell us —{" "}
          <a
            href="mailto:support@mycvbuddy.com"
            className="text-foreground underline underline-offset-4"
          >
            support@mycvbuddy.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
