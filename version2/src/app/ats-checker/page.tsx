import Link from "next/link";
import AtsCheckerForm from "@/components/AtsCheckerForm";

export const metadata = { title: "Free ATS Checker — MyCV Buddy" };

export default function AtsCheckerPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight sm:text-4xl">
        Free ATS Checker
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Paste your CV and a job description to get an instant applicant
        tracking system match score, plus what&apos;s missing. No account needed —
        nothing you paste here is saved.
      </p>

      <div className="mt-12">
        <AtsCheckerForm />
      </div>

      <p className="mt-12 text-sm text-muted">
        Want your CV automatically rewritten to close these gaps?{" "}
        <Link href="/signup" className="text-foreground underline underline-offset-4">
          Create a free account
        </Link>{" "}
        and let MyCV Buddy tailor it for you.
      </p>
    </main>
  );
}
