import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import { updatePassword } from "@/app/actions/auth";

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg tracking-tight">
          mycv<span className="text-accent">buddy</span>
        </Link>
        <h1 className="mt-8 font-display text-3xl tracking-tight">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-muted">
          Choose a new password for your account.
        </p>

        <AuthForm
          action={updatePassword}
          submitLabel="Update password"
          pendingLabel="Updating…"
          fields="password-only"
        />
      </div>
    </main>
  );
}
