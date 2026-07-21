"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCvButton({ cvId }: { cvId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this CV? This can't be undone.")) return;

    setPending(true);
    const res = await fetch(`/api/delete-cv/${cvId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setPending(false);
      alert("Failed to delete. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="min-h-[44px] rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-red-400/60 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete CV"}
    </button>
  );
}
