import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { requestPasswordReset } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg tracking-tight">
          mycv<span className="text-accent">buddy</span>
        </Link>
        <h1 className="mt-8 font-display text-3xl tracking-tight">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <AuthForm
          action={requestPasswordReset}
          submitLabel="Send reset link"
          pendingLabel="Sending…"
          fields="email-only"
        />

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
