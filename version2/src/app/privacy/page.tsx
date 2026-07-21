import Link from "next/link";

export const metadata = { title: "Privacy Policy — MyCV Buddy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated 18 July 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-medium text-foreground">
            What we collect
          </h2>
          <p className="mt-2">
            Your email address and password (for account creation), the CV
            files you upload and the text extracted from them, any job
            descriptions you paste in, and the tailored CVs we generate for
            you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            How we use it
          </h2>
          <p className="mt-2">
            Your CV text and the job descriptions you provide are sent to
            OpenAI&apos;s API to parse and tailor your CV. OpenAI does not use
            API data to train its models by default. We don&apos;t sell your
            data or share it with anyone else.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            Where it&apos;s stored
          </h2>
          <p className="mt-2">
            Your account and CV data are stored with Supabase. Authentication
            uses secure, httpOnly session cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">Payments</h2>
          <p className="mt-2">
            MyCV Buddy does not currently process payments. If that changes,
            this page will be updated before any payment feature goes live.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            Deleting your data
          </h2>
          <p className="mt-2">
            To delete your account and all associated data, email{" "}
            <a
              href="mailto:support@mycvbuddy.com"
              className="text-foreground underline underline-offset-4"
            >
              support@mycvbuddy.com
            </a>{" "}
            and we&apos;ll remove it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about this policy? Email{" "}
            <a
              href="mailto:support@mycvbuddy.com"
              className="text-foreground underline underline-offset-4"
            >
              support@mycvbuddy.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
