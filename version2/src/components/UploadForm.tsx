"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import UploadProgress from "./UploadProgress";

export default function UploadForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setPending(true);
    setError(null);

    try {
      // Sent as base64 JSON, not multipart/form-data - see api/upload's
      // route comment: Next's multipart parser was confirmed corrupting
      // certain valid DOCX files' binary content in production.
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        setPending(false);
        return;
      }

      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch {
      setError("Upload failed. Please check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center transition-colors ${
          compact ? "px-6 py-10" : "px-6 py-16"
        } ${dragging ? "border-accent bg-surface" : "border-border"}`}
      >
        <UploadCloud
          className="h-6 w-6 text-muted"
          strokeWidth={1.5}
        />
        <p className="font-display text-lg">
          {pending ? "Uploading…" : "Upload a CV"}
        </p>
        <p className="max-w-xs text-sm text-muted">
          Drag and drop a PDF or Word document here, or click to upload.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          aria-label="Upload a CV file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="mt-2 min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Choose file"}
        </button>
      </div>
      {pending && (
        <div className="mt-4">
          <UploadProgress />
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
