import { getOpenAIClient } from "./openai";
import type { CVSection } from "./cv-parsing";
import { normalizeSectionContent } from "./cv-content-normalize";

export async function generateCVFromBackground(
  name: string,
  contact: string,
  background: string
): Promise<CVSection[]> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content:
          "You are an expert CV writer. Turn a person's plain-language description of their background into a well-structured, detailed CV. Only use facts they actually stated — never invent employers, dates, qualifications, or achievements — but DO expand what they said into full professional CV phrasing rather than copying their casual sentence verbatim. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Build CV sections from this background, written by the candidate in their own words:

${background.substring(0, 6000)}

Return JSON: {"sections": [{"type": "summary"|"experience"|"education"|"skills"|"certifications"|"additional", "content": "...", "order": 0}]}

Rules:
- "content" must ALWAYS be a single plain string — never a nested object or array, even when there are multiple jobs or qualifications. Put every entry inside the same string, separated by a blank line between entries.
- "summary": a tight 3-4 line professional profile.
- "experience": for EACH job mentioned, write "Job title, Employer (dates)" on its own line, then 2-4 bullet points below it (each starting with "- " and a strong action verb) describing responsibilities/impact — written as full professional CV bullets, not a copy-paste of the candidate's casual sentence. Base every bullet only on what they actually described; if they gave few details for a role, write fewer, plainer bullets rather than inventing specifics.
- "education": "Qualification, Institution (dates)" per entry, one per line/block, with any relevant detail they mentioned as a bullet underneath.
- Do not include "name" or "contact" sections — those are handled separately.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.sections)) {
    throw new Error("Invalid AI generation response");
  }

  const generated: CVSection[] = parsed.sections.map(
    (s: CVSection, i: number) => ({
      type: s.type,
      content: normalizeSectionContent(s.content),
      order: i + 2,
    })
  );

  return [
    { type: "name", content: name, order: 0 },
    { type: "contact", content: contact, order: 1 },
    ...generated,
  ];
}
