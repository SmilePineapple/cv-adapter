import { renderClassic } from "./classic";
import { renderModern } from "./modern";
import { renderTwoColumn, classifyForTwoColumn } from "./two-column";
import type { FillScale, TemplateSection } from "./shared";

export type { TemplateSection, FillScale } from "./shared";
export { renderTwoColumn, classifyForTwoColumn };

export type TemplateId = "classic" | "modern" | "two-column";

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
}[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Serif, single column. Safest choice for conservative industries and ATS.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif with a coral accent. Good default for most roles.",
  },
  {
    id: "two-column",
    name: "Two-Column",
    description: "Dense sidebar layout for content-heavy CVs.",
  },
];

const RENDERERS: Record<
  TemplateId,
  (sections: TemplateSection[], scale?: FillScale) => string
> = {
  classic: renderClassic,
  modern: renderModern,
  // Uniform-scale entry point (used when the caller doesn't need
  // independent sidebar/main fill) — renderTwoColumn is also exported
  // directly for cv-fill.ts's per-column balanced search.
  "two-column": (sections, scale) => renderTwoColumn(sections, scale, scale),
};

export function isTemplateId(value: string): value is TemplateId {
  return value in RENDERERS;
}

export function renderTemplate(
  templateId: string,
  sections: TemplateSection[],
  scale: FillScale = {}
): string {
  const id = isTemplateId(templateId) ? templateId : "classic";
  return RENDERERS[id](sections, scale);
}
