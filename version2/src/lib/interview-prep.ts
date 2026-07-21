import { getOpenAIClient } from "./openai";
import type { CVSection } from "./cv-parsing";

export type InterviewQuestion = {
  question: string;
  why_theyre_asking: string;
  suggested_approach: string;
};

export type InterviewPrepResult = {
  questions: InterviewQuestion[];
  questions_to_ask_them: string[];
};

export async function generateInterviewPrep(
  sections: CVSection[],
  jobTitle: string,
  jobDescription: string
): Promise<InterviewPrepResult> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 2200,
    messages: [
      {
        role: "system",
        content:
          "You are an expert interview coach. Generate realistic interview questions tailored to this specific candidate and role, plus how they should approach answering given their actual background. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Generate interview prep for the role "${jobTitle}".

Job description:
${jobDescription.substring(0, 3000)}

Candidate's CV sections (JSON):
${JSON.stringify(sections)}

Generate 8 likely interview questions (mix of behavioral, technical/role-specific, and questions probing gaps or transitions visible in their CV). For each, explain briefly why an interviewer would ask it and how this specific candidate should approach answering it using their real background.

Also suggest 4 good questions the candidate should ask the interviewer, relevant to this specific role.

Return JSON: {
  "questions": [{"question": "...", "why_theyre_asking": "...", "suggested_approach": "..."}],
  "questions_to_ask_them": ["..."]
}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  const parsed = JSON.parse(raw);
  return {
    questions: Array.isArray(parsed.questions) ? parsed.questions : [],
    questions_to_ask_them: Array.isArray(parsed.questions_to_ask_them)
      ? parsed.questions_to_ask_them
      : [],
  };
}
