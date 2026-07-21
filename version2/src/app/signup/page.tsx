import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg tracking-tight">
          mycv<span className="text-accent">buddy</span>
        </Link>
        <h1 className="mt-8 font-display text-3xl tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Free to start. No card required.
        </p>

        <div className="mt-8">
          <GoogleAuthButton />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <AuthForm action={signup} submitLabel="Create account" pendingLabel="Creating account…" />

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
