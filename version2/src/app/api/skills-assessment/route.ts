import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSkillsQuiz } from "@/lib/skills-quiz";
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
  const cvId = typeof body.cvId === "string" ? body.cvId : "";
  const manualSkills = typeof body.skills === "string" ? body.skills.trim() : "";
  const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : undefined;

  let skills = manualSkills;

  if (!skills && cvId) {
    const { data: cv } = await supabase
      .from("cvs")
      .select("parsed_sections")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();

    if (cv) {
      const sections = (cv.parsed_sections as { sections: CVSection[] }).sections;
      skills = sections.find((s) => s.type === "skills")?.content || "";
    }
  }

  if (!skills) {
    return NextResponse.json(
      { error: "No skills to test — select a CV with a skills section, or type some in." },
      { status: 400 }
    );
  }

  let questions;
  try {
    questions = await generateSkillsQuiz(skills, jobTitle);
  } catch (err) {
    console.error("Skills quiz generation failed:", err);
    return NextResponse.json({ error: "Failed to generate quiz." }, { status: 500 });
  }

  // Persist using the existing skill_assessments/questions schema (shared
  // Supabase project already has these tables from legacy-v1 — reused as-is,
  // no migration needed). Best-effort: if saving fails, the quiz still
  // works, it just won't show up in history. skill_assessment_questions
  // and skill_assessment_results only have RLS policies for service-role
  // writes, not the user's own session (confirmed directly — a normal
  // authenticated insert throws 42501) — those two use the admin client;
  // skill_assessments itself allows a direct user insert.
  const admin = createAdminClient();

  const { data: assessment } = await supabase
    .from("skill_assessments")
    .insert({
      user_id: user.id,
      job_role: jobTitle || "General",
      job_description: skills,
      total_questions: questions.length,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  let savedQuestions = questions.map((q, i) => ({ ...q, id: null as string | null, index: i }));

  if (assessment) {
    const { data: inserted, error: insertError } = await admin
      .from("skill_assessment_questions")
      .insert(
        questions.map((q, i) => ({
          assessment_id: assessment.id,
          question_number: i + 1,
          question_type: "multiple_choice",
          skill_category: jobTitle || "General",
          question_text: q.question,
          options: q.options,
          correct_answer: String(q.correctIndex),
          explanation: q.explanation,
        }))
      )
      .select("id, question_number");

    if (insertError) {
      console.error("Failed to persist skill_assessment_questions:", insertError);
    }

    if (inserted) {
      const byNumber = new Map(inserted.map((r) => [r.question_number, r.id]));
      savedQuestions = questions.map((q, i) => ({
        ...q,
        id: byNumber.get(i + 1) || null,
        index: i,
      }));
    }
  }

  return NextResponse.json({ assessmentId: assessment?.id || null, questions: savedQuestions });
}
