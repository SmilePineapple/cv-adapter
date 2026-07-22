import { getOpenAIClient } from "./openai";
import type { CVSection } from "./cv-parsing";
import { normalizeSectionContent } from "./cv-content-normalize";

export type TailorResult = {
  sections: CVSection[];
  ats_score: number;
};

export async function tailorCV(
  sections: CVSection[],
  jobTitle: string,
  jobDescription: string
): Promise<TailorResult> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.4,
    // Rewriting every section at full bullet-level detail (not summarizing)
    // means output size is comparable to or larger than the input CV's own
    // text. 3500 was too tight - confirmed via production data that it
    // caused gpt-4o-mini to silently stop early with a technically-valid
    // but incomplete sections array (e.g. only "hobbies"/"additional"
    // surviving out of 11 input sections), which sailed through the
    // Array.isArray check below untouched and got saved/exported as a
    // near-blank CV. gpt-4o-mini's completion limit is 16384.
    max_tokens: 8000,
    messages: [
      {
        role: "system",
        content:
          "You are an expert CV writer. You tailor CVs to specific jobs by re-emphasizing relevant experience and using language the job description uses, WITHOUT inventing facts, employers, dates, or qualifications that aren't in the original CV. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Tailor this CV for the role "${jobTitle}".

Job description:
${jobDescription.substring(0, 4000)}

Original CV sections (JSON):
${JSON.stringify(sections)}

Rules:
- Keep the same section types and roughly the same structure.
- "content" must ALWAYS be a single plain string — never a nested object or array, even for "experience" with multiple jobs. Keep every entry's own line breaks/bullets exactly as structured in the original (e.g. "Job title, Employer (dates)" line followed by "- " bullets) — don't collapse a multi-bullet entry down into one flat sentence.
- Rewrite "summary", "experience", "skills" content to emphasize what's relevant to this job and mirror its terminology, without fabricating anything not present in the original. Keep the same level of bullet-level detail as the original — tailoring means re-emphasizing and re-wording, not shortening.
- Leave "name" and "contact" unchanged.
- Also estimate an ATS match score 0-100 for the tailored CV against this job description.

Return JSON: {"sections": [{"type": "...", "content": "...", "order": 0}], "ats_score": 0}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.sections)) {
    throw new Error("Invalid AI tailoring response");
  }

  const tailoredSections: CVSection[] = parsed.sections.map((s: CVSection, i: number) => ({
    type: s.type,
    content: normalizeSectionContent(s.content),
    order: typeof s.order === "number" ? s.order : i,
  }));

  // A truncated/early-stopped response is syntactically valid JSON with
  // just fewer sections - Array.isArray above doesn't catch that. Rather
  // than silently persisting (and later exporting) a CV missing most of
  // its original content, fail loudly so the caller can retry.
  const inputTypes = new Set(sections.map((s) => s.type));
  const outputTypes = new Set(tailoredSections.map((s) => s.type));
  const droppedTypes = [...inputTypes].filter((t) => !outputTypes.has(t));
  if (droppedTypes.length > 0) {
    throw new Error(
      `AI tailoring dropped section(s) present in the original CV: ${droppedTypes.join(", ")}`
    );
  }

  return {
    sections: tailoredSections,
    ats_score:
      typeof parsed.ats_score === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.ats_score)))
        : 0,
  };
}
