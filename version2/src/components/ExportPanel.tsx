"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { TEMPLATES, type TemplateId } from "@/lib/cv-templates";

export default function ExportPanel({ generationId }: { generationId: string }) {
  const [template, setTemplate] = useState<TemplateId>("classic");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            title={t.description}
            className={`min-h-[36px] rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              template === t.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-foreground/40"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={`/api/export/${generationId}?template=${template}`}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent/90"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          Export as PDF
        </a>
        <a
          href={`/api/export/${generationId}?format=docx`}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          Export as DOCX
        </a>
      </div>
    </div>
  );
}
