import { getOpenAIClient } from "./openai";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export async function generateSkillsQuiz(
  skills: string,
  jobTitle?: string
): Promise<QuizQuestion[]> {
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
          "You write practical, real-world multiple-choice skills assessment questions — the kind that test genuine working knowledge, not trivia. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Write 8 multiple-choice questions testing practical knowledge of these skills: ${skills.substring(0, 1500)}${
          jobTitle ? `\n\nContext: this is for someone applying to a "${jobTitle}" role, so weight questions toward what that role actually requires.` : ""
        }

Each question needs exactly 4 options, one correct. Vary difficulty. Test applied understanding, not definitions.

Return JSON: {"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0, "explanation": "why this is correct, one sentence"}]}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.questions)) {
    throw new Error("Invalid AI quiz response");
  }

  return parsed.questions
    .filter(
      (q: QuizQuestion) =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctIndex === "number"
    )
    .map((q: QuizQuestion) => ({
      question: q.question,
      options: q.options,
      correctIndex: Math.max(0, Math.min(3, Math.round(q.correctIndex))),
      explanation: q.explanation || "",
    }));
}
