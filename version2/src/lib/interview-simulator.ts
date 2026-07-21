import { getOpenAIClient } from "./openai";
import type { CVSection } from "./cv-parsing";

export type SimulatorTurn = { question: string; answer: string };

export type AnswerFeedback = {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

const MAX_QUESTIONS = 5;

export async function evaluateAnswer(
  question: string,
  answer: string,
  jobTitle: string
): Promise<AnswerFeedback> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.4,
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content:
          "You are a mock interviewer giving direct, useful feedback on a spoken-style interview answer. Return valid JSON only.",
      },
      {
        role: "user",
        content: `Role being interviewed for: ${jobTitle}

Question: ${question}

Candidate's answer: ${answer}

Return JSON: {"score": 0-10, "feedback": "one short paragraph", "strengths": ["..."], "improvements": ["..."]}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");
  const parsed = JSON.parse(raw);

  return {
    score: Math.max(0, Math.min(10, Math.round(parsed.score ?? 5))),
    feedback: String(parsed.feedback || ""),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
  };
}

export async function generateNextQuestion(
  jobTitle: string,
  jobDescription: string,
  cvSections: CVSection[],
  history: SimulatorTurn[]
): Promise<string | null> {
  if (history.length >= MAX_QUESTIONS) return null;

  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    max_tokens: 150,
    messages: [
      {
        role: "system",
        content:
          "You are conducting a live mock interview, one question at a time. Ask one realistic, specific interview question — no preamble, no numbering, just the question itself.",
      },
      {
        role: "user",
        content: `Role: ${jobTitle}

Job description:
${jobDescription.substring(0, 2000)}

Candidate's CV:
${JSON.stringify(cvSections).substring(0, 2000)}

Questions asked so far and how they answered:
${history.map((h, i) => `${i + 1}. Q: ${h.question}\nA: ${h.answer}`).join("\n\n") || "None yet — this is the first question."}

Ask the next question. Don't repeat topics already covered. Mix behavioral and role-specific questions across the interview.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");
  return raw.trim();
}

export { MAX_QUESTIONS };
