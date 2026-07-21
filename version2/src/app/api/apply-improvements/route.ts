import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyImprovements, type ReviewResult } from "@/lib/cv-review";
import { scoreAgainstJob } from "@/lib/ats-score";
import { requireProGate } from "@/lib/subscription";
import type { CVSection } from "@/lib/cv-parsing";
import { normalizeSectionContent } from "@/lib/cv-content-normalize";

export const runtime = "nodejs";
export const maxDuration = 60;

function sectionsToText(sections: CVSection[]): string {
  return sections.map((s) => normalizeSectionContent(s.content)).join("\n\n");
}

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
  const review = body.review as ReviewResult;

  if (!generationId || !review) {
    return NextResponse.json(
      { error: "generationId and review are required." },
      { status: 400 }
    );
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

  const currentSections = (generation.output_sections as { sections: CVSection[] }).sections;
  const jobDescription = generation.job_description || "";

  let result;
  try {
    result = await applyImprovements(
      currentSections,
      generation.job_title,
      jobDescription,
      review
    );
  } catch (err) {
    console.error("Applying improvements failed:", err);
    return NextResponse.json({ error: "Failed to apply improvements." }, { status: 500 });
  }

  const beforeScore = scoreAgainstJob(sectionsToText(currentSections), jobDescription).score;
  const afterScore = scoreAgainstJob(sectionsToText(result.sections), jobDescription).score;

  if (afterScore < beforeScore) {
    return NextResponse.json(
      {
        error:
          "The improved version scored lower on keyword match than your current CV, so it wasn't saved. Try again, or tweak the job description for more context.",
      },
      { status: 422 }
    );
  }

  const { error: updateError } = await supabase
    .from("generations")
    .update({
      output_sections: { sections: result.sections },
      ats_score: Math.max(result.ats_score, afterScore),
    })
    .eq("id", generationId)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to save improved CV: " + updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, ats_score: Math.max(result.ats_score, afterScore) });
}
