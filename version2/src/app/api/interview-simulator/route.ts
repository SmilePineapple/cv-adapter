import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  evaluateAnswer,
  generateNextQuestion,
  type SimulatorTurn,
} from "@/lib/interview-simulator";
import { requireProGate } from "@/lib/subscription";
import type { CVSection } from "@/lib/cv-parsing";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gate = await requireProGate(supabase, user.id);
  if (gate) return gate;

  const body = await request.json();
  const generationId = String(body.generationId || "");
  const history = Array.isArray(body.history) ? (body.history as SimulatorTurn[]) : [];
  const currentQuestion = typeof body.currentQuestion === "string" ? body.currentQuestion : "";
  const currentAnswer = typeof body.currentAnswer === "string" ? body.currentAnswer.trim() : "";

  if (!generationId) {
    return NextResponse.json({ error: "generationId is required." }, { status: 400 });
  }

  const { data: generation, error } = await supabase
    .from("generations")
    .select("id, job_title, job_description, output_sections")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (error || !generation) {
    return NextResponse.json({ error: "Generation not found." }, { status: 404 });
  }

  const sections = (generation.output_sections as { sections: CVSection[] }).sections;
  const jobTitle = generation.job_title;
  const jobDescription = generation.job_description || "";

  try {
    let feedback = null;
    let updatedHistory = history;

    if (currentQuestion && currentAnswer) {
      feedback = await evaluateAnswer(currentQuestion, currentAnswer, jobTitle);
      updatedHistory = [...history, { question: currentQuestion, answer: currentAnswer }];
    }

    const nextQuestion = await generateNextQuestion(
      jobTitle,
      jobDescription,
      sections,
      updatedHistory
    );

    return NextResponse.json({
      feedback,
      nextQuestion,
      done: nextQuestion === null,
      questionNumber: updatedHistory.length + (nextQuestion ? 1 : 0),
    });
  } catch (err) {
    console.error("Interview simulator failed:", err);
    return NextResponse.json({ error: "Failed to continue the interview." }, { status: 500 });
  }
}
