import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 30;

type AnswerInput = { questionId: string; selectedIndex: number };

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const assessmentId = typeof body.assessmentId === "string" ? body.assessmentId : "";
  const answers: AnswerInput[] = Array.isArray(body.answers) ? body.answers : [];

  if (!assessmentId || answers.length === 0) {
    return NextResponse.json({ error: "assessmentId and answers are required." }, { status: 400 });
  }

  const { data: assessment } = await supabase
    .from("skill_assessments")
    .select("id")
    .eq("id", assessmentId)
    .eq("user_id", user.id)
    .single();

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  // skill_assessment_questions/answers/results only have RLS policies for
  // service-role writes (and, empirically, reads) — see admin.ts. Ownership
  // is already verified above via the user-session query on
  // skill_assessments, so it's safe to use the admin client from here.
  const admin = createAdminClient();

  const { data: questions } = await admin
    .from("skill_assessment_questions")
    .select("id, correct_answer, points")
    .eq("assessment_id", assessmentId);

  const correctById = new Map((questions || []).map((q) => [q.id, q.correct_answer]));
  const pointsById = new Map((questions || []).map((q) => [q.id, q.points || 10]));

  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;

  const answerRows = answers.map((a) => {
    const correctAnswer = correctById.get(a.questionId);
    const points = pointsById.get(a.questionId) ?? 10;
    const isCorrect = correctAnswer !== undefined && String(a.selectedIndex) === correctAnswer;
    maxScore += points;
    if (isCorrect) {
      totalScore += points;
      correctCount += 1;
    }
    return {
      assessment_id: assessmentId,
      question_id: a.questionId,
      user_answer: String(a.selectedIndex),
      is_correct: isCorrect,
      points_earned: isCorrect ? points : 0,
    };
  });

  await admin.from("skill_assessment_answers").insert(answerRows);

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const { data: result } = await admin
    .from("skill_assessment_results")
    .insert({
      assessment_id: assessmentId,
      user_id: user.id,
      total_score: totalScore,
      max_score: maxScore,
      percentage_score: percentage,
      questions_correct: correctCount,
      questions_total: answers.length,
    })
    .select("id")
    .single();

  await supabase
    .from("skill_assessments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", assessmentId);

  return NextResponse.json({
    resultId: result?.id,
    score: correctCount,
    total: answers.length,
    percentage,
  });
}
