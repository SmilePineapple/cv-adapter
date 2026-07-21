import Link from "next/link";
import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — MyCV Buddy" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight sm:text-4xl">
        Contact
      </h1>
      <p className="mt-3 text-muted">
        Questions, bug reports, feedback, or a data-deletion request —
        send us a message and we&apos;ll get back to you.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <ContactForm />
      </div>

      <a
        href="mailto:support@mycvbuddy.com"
        className="mt-6 flex items-center gap-3 rounded-2xl border border-border px-5 py-4 text-sm transition-colors hover:border-foreground/30"
      >
        <Mail className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
        <span className="text-muted">
          Prefer email? Reach us directly at{" "}
          <span className="text-foreground">support@mycvbuddy.com</span>
        </span>
      </a>
    </main>
  );
}
