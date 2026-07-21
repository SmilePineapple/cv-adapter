import { getOpenAIClient } from "./openai";
import { normalizeSectionContent } from "./cv-content-normalize";
import type { CVSection } from "./cv-parsing";

export type ReviewResult = {
  overall_assessment: string;
  strengths: string[];
  improvements: string[];
  missing_sections: string[];
  keywords_to_add: string[];
  formatting_tips: string[];
};

export async function reviewCV(
  sections: CVSection[],
  jobTitle: string,
  jobDescription: string
): Promise<ReviewResult> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content:
          "You are an expert CV reviewer and career coach. Give honest, specific, actionable feedback. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Review this CV for the role "${jobTitle}".

Job description:
${jobDescription.substring(0, 3000)}

CV sections (JSON):
${JSON.stringify(sections)}

Return JSON: {
  "overall_assessment": "one short paragraph",
  "strengths": ["..."],
  "improvements": ["specific, actionable suggestions"],
  "missing_sections": ["section types that would help but are absent"],
  "keywords_to_add": ["terms from the job description missing from the CV"],
  "formatting_tips": ["..."]
}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  const parsed = JSON.parse(raw);
  return {
    overall_assessment: String(parsed.overall_assessment || ""),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    missing_sections: Array.isArray(parsed.missing_sections) ? parsed.missing_sections : [],
    keywords_to_add: Array.isArray(parsed.keywords_to_add) ? parsed.keywords_to_add : [],
    formatting_tips: Array.isArray(parsed.formatting_tips) ? parsed.formatting_tips : [],
  };
}

export async function applyImprovements(
  sections: CVSection[],
  jobTitle: string,
  jobDescription: string,
  review: ReviewResult
): Promise<{ sections: CVSection[]; ats_score: number }> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 3500,
    messages: [
      {
        role: "system",
        content:
          "You are an expert CV writer applying specific improvements to a CV. You only ADD or SHARPEN wording — you never remove real content, invent employers/dates/qualifications, or fabricate anything not implied by the original CV. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Apply these improvements to the CV below, tailored for "${jobTitle}".

Job description:
${jobDescription.substring(0, 3000)}

Improvements to apply:
${review.improvements.join("\n- ")}

Keywords to naturally incorporate where truthful:
${review.keywords_to_add.join(", ")}

Original CV sections (JSON):
${JSON.stringify(sections)}

Rules:
- Keep the same section types.
- Only rewrite "summary", "experience", "skills" content — leave "name" and "contact" unchanged.
- Do not remove any real achievement or shorten content overall.
- Also estimate the resulting ATS match score 0-100 against this job description.

Return JSON: {"sections": [{"type": "...", "content": "...", "order": 0}], "ats_score": 0}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.sections)) {
    throw new Error("Invalid AI improvement response");
  }

  return {
    sections: parsed.sections.map((s: CVSection, i: number) => ({
      type: s.type,
      content: normalizeSectionContent(s.content),
      order: typeof s.order === "number" ? s.order : i,
    })),
    ats_score:
      typeof parsed.ats_score === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.ats_score)))
        : 0,
  };
}
