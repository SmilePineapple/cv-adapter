import { getOpenAIClient } from "./openai";
import { normalizeSectionContent } from "./cv-content-normalize";

export type CVSection = {
  type: string;
  content: string;
  order: number;
};

export type ParsedCV = {
  sections: CVSection[];
  raw_text: string;
};

const SECTION_TYPES = [
  "name",
  "contact",
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "hobbies",
  "groups",
  "strengths",
  "additional",
] as const;

function simpleFallbackParse(text: string): ParsedCV {
  // Best-effort split when AI parsing is unavailable or fails: everything
  // lands in one section rather than being silently dropped.
  return {
    sections: [{ type: "additional", content: text, order: 0 }],
    raw_text: text,
  };
}

export async function parseCVSections(text: string): Promise<ParsedCV> {
  let openai;
  try {
    openai = getOpenAIClient();
  } catch {
    return simpleFallbackParse(text);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.1,
      // Was 3000 - too tight for the "use EXACT content, don't summarize"
      // instruction below on longer CVs, for the same reason cv-tailoring.ts's
      // max_tokens needed raising: an early-stopped response is still valid
      // JSON, just missing most sections, and nothing here caught that.
      // gpt-4o-mini's completion limit is 16384.
      max_tokens: 8000,
      messages: [
        {
          role: "system",
          content:
            "You are a CV parsing expert. Extract structured information from CVs in any language. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Extract ALL sections from this CV.

CV Text:
${text.substring(0, 8000)}${text.length > 8000 ? "..." : ""}

IMPORTANT: Extract EVERY section you find, including:
- Name, Contact, Profile/Summary
- Work Experience (all jobs with full details)
- Education (all qualifications)
- Skills (ALL skills listed)
- Certifications/Licenses
- Hobbies/Interests
- Groups/Memberships
- Strengths/Core Competencies
- Any other sections present

Return JSON: {"sections": [{"type": "name"|"contact"|"summary"|"experience"|"education"|"skills"|"certifications"|"hobbies"|"groups"|"strengths"|"additional", "content": "...", "order": 0}]}

CRITICAL: Use EXACT content from the CV. Do NOT summarize or skip anything. "content" must ALWAYS be a single plain string — never a nested object or array, even for "experience" with multiple jobs. Preserve the original line breaks and bullet points within that one string (e.g. "Job title, Employer (dates)" on its own line, followed by "- " bullets on their own lines).`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("No response from AI");

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.sections)) {
      throw new Error("Invalid AI response structure");
    }

    const sections: CVSection[] = parsed.sections
      // Normalize BEFORE filtering — the AI sometimes returns "content" as
      // a nested object/array instead of a string (see
      // cv-content-normalize.ts). Filtering on typeof content === "string"
      // first would silently drop those sections entirely (a whole
      // "experience" section vanishing, not just malformed), which is far
      // worse than a render crash since nothing here would look wrong at
      // a glance.
      .map((s: unknown, i: number) => {
        const section = s as Partial<CVSection>;
        return {
          type: SECTION_TYPES.includes(section.type as (typeof SECTION_TYPES)[number])
            ? section.type!
            : "additional",
          content: normalizeSectionContent(section?.content),
          order: typeof section.order === "number" ? section.order : i,
        };
      })
      .filter((s: CVSection) => s.content.trim().length > 0);

    if (sections.length === 0) throw new Error("AI returned no sections");

    // The prompt tells the model to use exact, unsummarized content, so a
    // healthy parse's total section length should track the source text
    // fairly closely. A response that's technically valid JSON but stopped
    // early (see the max_tokens comment above) still passes every check
    // above while covering only a fraction of the CV - fall back to
    // simpleFallbackParse (which keeps 100% of the text, just unsectioned)
    // rather than silently persisting a CV that's mostly missing.
    const inputSample = text.substring(0, 8000);
    const totalParsedLength = sections.reduce(
      (sum, s) => sum + s.content.length,
      0
    );
    if (inputSample.length > 1500 && totalParsedLength < inputSample.length * 0.4) {
      throw new Error(
        `AI parsing looks truncated: ${totalParsedLength} chars parsed from ${inputSample.length} chars of source`
      );
    }

    return { sections, raw_text: text };
  } catch (err) {
    console.error("AI CV parsing failed, using fallback:", err);
    return simpleFallbackParse(text);
  }
}
