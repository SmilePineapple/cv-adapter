import Link from "next/link";

export const metadata = { title: "Terms of Service — MyCV Buddy" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated 18 July 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-medium text-foreground">
            The service
          </h2>
          <p className="mt-2">
            MyCV Buddy lets you upload a CV and generate versions tailored to
            specific job descriptions using AI. The output is a starting
            point — review it before you send it anywhere.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            Accuracy
          </h2>
          <p className="mt-2">
            We instruct the AI not to invent employers, dates, or
            qualifications you didn&apos;t provide, but AI output can still
            contain mistakes. You&apos;re responsible for checking that
            anything you submit to an employer is accurate.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            Your account
          </h2>
          <p className="mt-2">
            You&apos;re responsible for keeping your login details secure and
            for what happens under your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            Acceptable use
          </h2>
          <p className="mt-2">
            Don&apos;t upload CVs that aren&apos;t yours, don&apos;t use the
            service to generate content for someone else&apos;s job
            application without their permission, and don&apos;t try to
            abuse or overload the service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">Changes</h2>
          <p className="mt-2">
            MyCV Buddy is under active development. Features may change or be
            added; we&apos;ll keep this page current.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">Contact</h2>
          <p className="mt-2">
            Questions? Email{" "}
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
