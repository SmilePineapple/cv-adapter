import { getOpenAIClient } from "./openai";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function chatWithCoach(
  history: ChatMessage[],
  cvContext?: string
): Promise<string> {
  const openai = getOpenAIClient();

  const systemPrompt = cvContext
    ? `You are an experienced, pragmatic career coach. Give specific, actionable advice grounded in the person's actual CV below — reference it directly where relevant rather than giving generic advice. Keep replies concise (a few short paragraphs or a short list, not an essay).\n\nTheir CV:\n${cvContext.substring(0, 4000)}`
    : "You are an experienced, pragmatic career coach. Give specific, actionable advice. Keep replies concise (a few short paragraphs or a short list, not an essay).";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    max_tokens: 600,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");
  return raw.trim();
}
