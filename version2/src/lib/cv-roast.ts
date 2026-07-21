import { getOpenAIClient } from "./openai";
import type { CVSection } from "./cv-parsing";

export type RoastLevel = "mild" | "medium" | "brutal";
export type RoastStyle = "funny" | "sarcastic" | "professional" | "savage";

const LEVEL_PROMPTS: Record<RoastLevel, string> = {
  mild: "Keep it gentle and encouraging — light teasing, mostly constructive.",
  medium: "Be honest and a bit cheeky — point out real weaknesses with humor.",
  brutal: "Go hard. Be ruthlessly funny about every weak point, no holding back.",
};

const STYLE_PROMPTS: Record<RoastStyle, string> = {
  funny: "Write like a witty friend giving comedic commentary.",
  sarcastic: "Write with dry, sarcastic wit throughout.",
  professional: "Write like a blunt but professional career coach with a dry sense of humor.",
  savage: "Write like a stand-up comedian doing a roast set — sharp, punchy, merciless.",
};

export async function roastCV(
  sections: CVSection[],
  level: RoastLevel,
  style: RoastStyle
): Promise<string> {
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.9,
    max_tokens: 700,
    messages: [
      {
        role: "system",
        content: `You are roasting someone's CV for entertainment. ${LEVEL_PROMPTS[level]} ${STYLE_PROMPTS[style]} Never invent facts about the person beyond what's in the CV. Keep it under 250 words. This is for fun, not a real performance review.`,
      },
      {
        role: "user",
        content: `Roast this CV:\n\n${JSON.stringify(sections)}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");
  return raw.trim();
}
