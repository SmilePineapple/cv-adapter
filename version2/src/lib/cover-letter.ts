import { getOpenAIClient } from "./openai";
import type { CVSection } from "./cv-parsing";

export async function generateCoverLetter(
  sections: CVSection[],
  jobTitle: string,
  jobDescription: string,
  companyName?: string,
  hiringManagerName?: string
): Promise<string> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    max_tokens: 900,
    messages: [
      {
        role: "system",
        content:
          "You are an expert cover letter writer. Write concise, genuine-sounding cover letters grounded only in facts present in the candidate's CV — never invent employers, achievements, or skills. No cliches like 'I am writing to express my interest'.",
      },
      {
        role: "user",
        content: `Write a cover letter for the role "${jobTitle}"${
          companyName ? ` at ${companyName}` : ""
        }.

${hiringManagerName ? `Address it to ${hiringManagerName}.` : "Use a generic professional greeting (no named recipient)."}

Job description:
${jobDescription.substring(0, 3000)}

Candidate's CV sections (JSON):
${JSON.stringify(sections)}

Write 3-4 short paragraphs: an opening connecting the candidate to the role, one or two paragraphs on relevant experience (using only what's in the CV), and a brief closing. Plain text only, no markdown, no placeholder brackets — if you don't have a detail (like company name), just omit it naturally rather than leaving a placeholder.`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return content.trim();
}
