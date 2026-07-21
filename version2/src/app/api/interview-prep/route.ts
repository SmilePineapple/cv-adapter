import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInterviewPrep } from "@/lib/interview-prep";
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

  if (!generationId) {
    return NextResponse.json({ error: "generationId is required." }, { status: 400 });
  }

  const { data: generation, error } = await supabase
    .from("generations")
    .select("id, cv_id, job_title, job_description, output_sections")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (error || !generation) {
    return NextResponse.json({ error: "Generation not found." }, { status: 404 });
  }

  const sections = (generation.output_sections as { sections: CVSection[] }).sections;

  try {
    const prep = await generateInterviewPrep(
      sections,
      generation.job_title,
      generation.job_description || ""
    );

    const { data: saved } = await supabase
      .from("interview_preps")
      .insert({
        user_id: user.id,
        cv_id: generation.cv_id,
        job_description: `${generation.job_title}\n\n${generation.job_description || ""}`,
        interview_data: prep,
      })
      .select("id, created_at")
      .single();

    return NextResponse.json({ ...prep, id: saved?.id, created_at: saved?.created_at });
  } catch (err) {
    console.error("Interview prep generation failed:", err);
    return NextResponse.json({ error: "Failed to generate interview prep." }, { status: 500 });
  }
}
