import { getOpenAIClient } from "./openai";

export type LinePreview = {
  original: string;
  improved: string;
};

// Deliberately the cheapest AI call in the app (~250 max_tokens, one line
// in and out) - this is the only OpenAI call reachable without a login, so
// it needs to stay small even before the per-IP rate limit in
// anon-rate-limit.ts kicks in. Picks and rewrites exactly one line, not a
// full section - a taste of the paid tailoring product, not a substitute
// for it.
export async function previewTailoredLine(
  cvText: string,
  jobDescription: string,
  missingKeywords: string[]
): Promise<LinePreview> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 250,
    messages: [
      {
        role: "system",
        content:
          "You improve a single CV line to better match a job description, without inventing facts, employers, dates, or qualifications not present in the original. Return valid JSON only.",
      },
      {
        role: "user",
        content: `From the CV text below, pick the ONE existing line (a bullet point or summary sentence) that reads weakest or most generic for this job, and rewrite just that line to be more specific and tailored - naturally working in 1-2 of the missing keywords if they genuinely fit, without fabricating anything.

CV text:
${cvText.slice(0, 6000)}

Job description:
${jobDescription.slice(0, 3000)}

Missing keywords: ${missingKeywords.slice(0, 10).join(", ") || "(none)"}

Return JSON: {"original": "the exact line as it appears in the CV", "improved": "the tailored rewrite of that one line"}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");
  const parsed = JSON.parse(raw);

  const original = String(parsed.original || "").trim();
  const improved = String(parsed.improved || "").trim();
  if (!original || !improved) throw new Error("Incomplete preview response");

  return { original, improved };
}
