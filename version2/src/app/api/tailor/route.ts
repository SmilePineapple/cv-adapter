import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tailorCV } from "@/lib/cv-tailoring";
import { checkAndConsumeGeneration, FREE_MONTHLY_GENERATION_LIMIT } from "@/lib/subscription";
import type { ParsedCV } from "@/lib/cv-parsing";

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

  const body = await request.json();
  const cvId = String(body.cvId || "");
  const jobTitle = String(body.jobTitle || "").trim();
  const jobDescription = String(body.jobDescription || "").trim();

  if (!cvId || !jobTitle || !jobDescription) {
    return NextResponse.json(
      { error: "cvId, jobTitle, and jobDescription are required." },
      { status: 400 }
    );
  }

  const { data: cv, error: cvError } = await supabase
    .from("cvs")
    .select("id, parsed_sections")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();

  if (cvError || !cv) {
    return NextResponse.json({ error: "CV not found." }, { status: 404 });
  }

  const usage = await checkAndConsumeGeneration(supabase, user.id);
  if (!usage.allowed) {
    return NextResponse.json(
      {
        error: `You've used all ${FREE_MONTHLY_GENERATION_LIMIT} free tailored CVs this month. Upgrade to Pro for unlimited generations.`,
        upgradeRequired: true,
      },
      { status: 402 }
    );
  }

  const parsedSections = cv.parsed_sections as ParsedCV;

  // checkAndConsumeGeneration above already spent one of the user's
  // monthly generations for this request - retry once here so a transient
  // AI truncation (see cv-tailoring.ts) doesn't burn their quota on a
  // request they have to immediately repeat themselves.
  let result;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2 && !result; attempt++) {
    try {
      result = await tailorCV(parsedSections.sections, jobTitle, jobDescription);
    } catch (err) {
      lastErr = err;
      console.error(`Tailoring attempt ${attempt + 1}/2 failed:`, err);
    }
  }
  if (!result) {
    console.error("Tailoring failed:", lastErr);
    return NextResponse.json(
      { error: "Failed to tailor CV. Please try again." },
      { status: 500 }
    );
  }

  const { data: generation, error: insertError } = await supabase
    .from("generations")
    .insert({
      user_id: user.id,
      cv_id: cv.id,
      job_title: jobTitle,
      job_description: jobDescription,
      output_sections: { sections: result.sections },
      ats_score: result.ats_score,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save tailored CV: " + insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: generation.id });
}
